<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ValidacoesAtributosMcpse extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'                  => $this->id,
            'titulo'              => $this->titulo,
            'origem'              => $this->origem,
            'tipo'                => $this->tipo,
            'status'              => $this->status,
            'arquivo_id'          => $this->arquivo_id,
            'arquivo_nome'        => $this->arquivo ? $this->arquivo->arquivo : null,
            'relatorio_id'        => $this->relatorio_id,
            'relatorio_nome'      => $this->relatorio_nome,
            'encoding'            => $this->encoding,
            'arquivo_delimitador' => $this->arquivo_delimitador,
            'arquivo_involucro'   => $this->arquivo_involucro,
            'arquivo_escape'      => $this->arquivo_escape,
            'usuario'             => $this->usuario->name,
            'executado_por'       => $this->executado_por,
            'data_processamento'  => $this->data_processamento,
            'created'             => $this->created_at
        ];
    }
}