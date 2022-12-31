<?php

namespace App\Repositories;

use App\ValidacaoAtributosMcpse;

class ValidacoesAtributosMcpseRepository 
{
    private $model;

    public function __construct(ValidacaoAtributosMcpse $model)
    {
        $this->model = $model;
    }
    
    public function findByCompanyId(int $companyId)
    {
        $validacoes = $this->model::query()
            ->where('company_id', $companyId)
            ->orWhere('company_id', null)
            ->orderByRaw("CASE WHEN status = 'EXPIRADO' THEN 0 ELSE 1 END DESC")
            ->orderByDesc('id');

        return $validacoes;
    }

    public function findByStatus(string $status)
    {
        return $this->model->where('status', $status);
    }

    public function findOrFail(int $id)
    {
        return $this->model->findOrFail($id);
    }

    public function getValidacaoMaisAntigaAguardando()
    {
        return $this->findByStatus('AGUARDANDO')->oldest()->first();
    }
}