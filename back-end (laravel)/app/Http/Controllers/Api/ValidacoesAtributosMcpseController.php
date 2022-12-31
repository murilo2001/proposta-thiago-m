<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Controllers\Controller;
use App\Http\Resources\ValidacoesAtributosMcpse as ValidacoesAtributosMcpseResource;
use App\Http\Requests\EditValidacoesAtributosMcpseRequest;
use App\Repositories\ValidacoesAtributosMcpseRepository;
use App\Services\ValidacoesAtributosMcpseService;
use App\ValidacaoAtributosMcpse;
use Exception;

class ValidacoesAtributosMcpseController extends Controller
{
    protected $validacaoMcpseRepository;

    public function __construct(ValidacoesAtributosMcpseRepository $validacoes)
    {
        $this->validacaoMcpseRepository = $validacoes;
    }

    public function getAllValidacoes()
    {
        $companyId = (int) request()->header('CompanyId');

        $validacoes = $this->validacaoMcpseRepository->findByCompanyId($companyId);
        return ValidacoesAtributosMcpseResource::collection($validacoes->get());
    }

    public function getValidacao(int $id) : JsonResource
    {
        return new ValidacoesAtributosMcpseResource(ValidacaoAtributosMcpse::find($id));
    }

    public function excluir(int $id)
    {
        try {

            $user = auth('api')->user();
            ValidacoesAtributosMcpseService::excluir(
                $id, 
                $user
            );

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return ['ok'];
    }

    public function executar(int $id)
    {
        try {

            $user = auth('api')->user();
            ValidacoesAtributosMcpseService::executar(
                $id, 
                $user
            );

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return ['ok'];
    }

    public function salvar(EditValidacoesAtributosMcpseRequest $request)
    {
        try {

            $dados = $request->all();
            $user = auth('api')->user();
            $companyId = (int) request()->header('CompanyId');

            ValidacoesAtributosMcpseService::salvar(
                $dados['id'], 
                $user,
                $dados,
                $companyId
            );

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }

        return ['ok'];
    }

    public function downloadArquivoResultado(int $id) 
    {
        $validacao = ValidacaoAtributosMcpse::find($id);
        return response()->download($validacao->arquivo_resultado_fullpath);
    }

    public function baixarArquivoReferencia(int $id) 
    {
        $validacao = ValidacaoAtributosMcpse::find($id);
        return response()->download($validacao->full_path_arquivo_csv);
    }

    public function baixarLogsTecnicos(int $id)
    {
        $validacao = ValidacaoAtributosMcpse::find($id);
        return response()->download(storage_path($validacao->log_tecnicos));
    }
}