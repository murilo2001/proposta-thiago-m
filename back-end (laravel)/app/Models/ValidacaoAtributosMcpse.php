<?php

namespace App;

use App\Traits\Models\TenantableTrait as Tenantable;

class ValidacaoAtributosMcpse extends ExpiraveisAbstract
{
    use Tenantable;

    protected $table = 'validacoes_atributos_mcpse';
    protected $campoUltimaExecucao = 'data_processamento';
    protected $fillable = [
        'titulo',
        'origem',
        'tipo',
        'status',
        'arquivo_id',
        'relatorio_id',
        'encoding',
        'arquivo_delimitador',
        'arquivo_involucro',
        'arquivo_escape',
        'usuario_id',
        'executado_por',
        'data_processamento',
        'company_id'
    ];

    protected $guarded = ['id'];

    public function usuario()
    {
        return $this->belongsTo(User::class, 'usuario_id');
    }

    public function usuario_executado_por()
    {
        return $this->belongsTo(User::class, 'executado_por');
    }

    public function relatorio()
    {
        return $this->belongsTo(Relatorio::class, 'relatorio_id');
    }

    public function arquivo()
    {
        return $this->belongsTo(Arquivo::class);
    }

    public function company()
    {
        return $this->belongsTo(Company::class);
    }

    public function getRelatorioNomeAttribute()
    {
        if ($this->relatorio) {
            return "#{$this->relatorio->id} - {$this->relatorio->nome}";
        } else {
            return null;
        }
    }

    public function getNomeTabelaTemporariaAttribute() : string
    {
        return "tmp_validacao_mcpse_{$this->id}";
    }

    public function getFullPathArquivoCsvAttribute() : string
    {
        if ($this->origem == 'RELATORIO') {
            $planilha = $this->relatorio->planilha()->first();
            return $planilha->full_path;
        } else {
            return $this->arquivo->full_path;
        }
    }

    public function getArquivoResultadoFullpathDirectoryAttribute()
    {
        return storage_path('app/validacoes-atributos-mcpse');
    }

    public function getArquivoResultadoFullpathAttribute()
    {
        return "{$this->arquivo_resultado_fullpath_directory}/validacao-{$this->id}.xlsx";
    }

    public function getLogTecnicosAttribute() : string
    {
        $data = $this->created_at->format('Y-m-d');
        return "logs/validacao-atributos-mcpse-processar-{$data}.log";
    }

    public function alteraStatus(string $novoStatus)
    {
        $this->status = $novoStatus;

        if (in_array($novoStatus, ['SUCESSO', 'FALHA'])) {
            $this->data_processamento = now();
        }
        
        $this->save();
    }

    public function getCabecalho()
    {
        if ($this->origem == 'RELATORIO') {
            $planilha = $this->relatorio->planilha()->first();
            $cabecalho = $planilha->getCabecalhoArquivo();
        } else {
            $cabecalho = $this->arquivo->getCabecalhoArquivoCSV(
                $this->arquivo_delimitador,
                $this->arquivo_involucro,
                $this->arquivo_escape
            );
        }

        $cabecalho = array_map(function($val) {
            return strtoupper($val);
        }, $cabecalho);

        return $cabecalho;
    }

    public function expirar()
    {
        $this->status = 'EXPIRADO';
        $this->save();
    }
}