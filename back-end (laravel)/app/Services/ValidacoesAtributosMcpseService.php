<?php

namespace App\Services;

use Illuminate\Support\Facades\{
    DB,
    Log
};
use App\{
    User, 
    ValidacaoAtributosMcpse
};
use Exception;

class ValidacoesAtributosMcpseService 
{
    public static function excluir(int $id, User $user) : bool 
    {
        try {

            DB::beginTransaction();
            
            $validacao = ValidacaoAtributosMcpse::find($id);
            $validacao->delete();

            // Remove o arquivo resultado
            /* FALTA TERMINAR */
            // if (!$validacao->removerArquivoResultado()) {
            //     throw new Exception("Ocorreu um erro ao tentar remover o arquivo do disco: {$validacao->fullpath}");
            // }

            DB::commit();

            Log::info("Validação de Atributos MCPSE [{$validacao->titulo}] excluída com sucesso, usuário {$user->name}");

        } catch (Exception $e) {
            
            DB::rollback();

            $error = "Falha ao excluir Validação de Atributos MCPSE [{$validacao->titulo}], usuário {$user->name}: {$e->getMessage()}";
            Log::error($error);
            throw new Exception($error);
        }

        return true;
    }

    public static function executar(int $id, User $user) : bool 
    {
        try {

            DB::beginTransaction();
            
            $validacao = ValidacaoAtributosMcpse::find($id);
            $validacao->fill([
                'status'             => 'AGUARDANDO',
                'executado_por'      => $user->id,
                'data_processamento' => null
            ]);
            $validacao->save();

            DB::commit();

            Log::info("Validação de Atributos MCPSE [{$validacao->titulo}] agendada para execução com sucesso, usuário {$user->name}");

        } catch (Exception $e) {
            
            DB::rollback();

            $error = "Falha ao agendar a Validação de Atributos MCPSE [{$validacao->titulo}] para execução, usuário {$user->name}: {$e->getMessage()}";
            Log::error($error);
            throw new Exception($error);
        }

        return true;
    }


    public static function salvar($id, User $user, array $dados, int $companyId) : ValidacaoAtributosMcpse 
    {
        $id = $id > 0 ? $id : null;

        try {

            DB::beginTransaction();
            
            $validacao = ValidacaoAtributosMcpse::firstOrNew([
                'id' => $id
            ]);

            $validacao->fill(array_merge($dados, [
                'status'             => 'AGUARDANDO',
                'executado_por'      => $user->id,
                'data_processamento' => null,
                'company_id'         => $companyId
            ]));

            if (!$id) $validacao->usuario_id = $user->id;

            $validacao->save();

            DB::commit();

            Log::info("Validação de Atributos MCPSE [{$dados['titulo']}] salva com sucesso, usuário {$user->name}");

            return $validacao;

        } catch (Exception $e) {
            
            DB::rollback();

            $error = "Falha ao salvar a Validação de Atributos MCPSE [{$dados['titulo']}], usuário {$user->name}: {$e->getMessage()}";
            Log::error($error);
            throw new Exception($error);
        }
    }
}