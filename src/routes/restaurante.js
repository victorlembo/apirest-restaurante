// API REST do RESTAURANTE
import express from 'express'
import sql from 'mssql'
import { sqlConfig } from '../sql/config.js'
const router = express.Router()

/*******************************************
 * GET /restaurante
 * Retornar a lista de todos os pratos
 ********************************************/
router.get("/", (req, res) => {
    try{
        sql.connect(sqlConfig).then(pool => {
            return pool.request()
            .execute('SP_S_RES_PRATOS')
        }).then(dados => {
            res.status(200).json(dados.recordset)
        }).catch(err => {
            res.status(400).json(err) //400 - Bad Request
        })
    } catch (err){
        console.error(err)
    }
})

/*******************************************
 * GET /restaurante/:nome
 * Retornar um prato através da nome
 ********************************************/
 router.get("/:nome", (req, res) => {
     const nome = req.params.nome
    try{
        sql.connect(sqlConfig).then(pool => {
            return pool.request()
            .input('nome', sql.VarChar(100), nome)
            .execute('SP_S_RES_PRATOS_FILTRO')
        }).then(dados => {
            res.status(200).json(dados.recordset)
        }).catch(err => {
            res.status(400).json(err) //400 - Bad Request
        })
    } catch (err){
        console.error(err)
    }
})
/*******************************************
 * POST /restaurante
 * Insere um novo prato
 ********************************************/
router.post("/", (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const {nome, descricao, preco} = req.body
        return pool.request()
        .input('nome', sql.VarChar(100), nome)
        .input('descricao', sql.VarChar(50), descricao)
        .input('preco', sql.Numeric, preco)
        .output('codigogerado', sql.Int)
        .execute('SP_I_RES_PRATOS')
    }).then(dados => {
        res.status(200).json(dados.output)
    }).catch(err => {
        res.status(400).json(err.message) // bad request
    })
})

/*******************************************
 * PUT /restaurante
 * Altera os dados de um prato
 ********************************************/
 router.put("/", (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const {codigo, nome, descricao, preco} = req.body
        return pool.request()
        .input('codigo', sql.Int, codigo)
        .input('nome', sql.VarChar(100), nome)
        .input('descricao', sql.VarChar(50), descricao)
        .input('preco', sql.Numeric, preco)
        .execute('SP_U_RES_PRATOS')
    }).then(dados => {
        res.status(200).json('Prato alterado com sucesso!')
    }).catch(err => {
        res.status(400).json(err.message) // bad request
    })
})

/*******************************************
 * DELETE /restaurante/:codigo
 * Apaga um prato pelo codigo
 ********************************************/
router.delete('/:codigo', (req, res) => {
    sql.connect(sqlConfig).then(pool => {
        const codigo = req.params.codigo
        return pool.request()
        .input('codigo', sql.Int, codigo)
        .execute('SP_D_RES_PRATOS')
    }).then(dados => {
        res.status(200).json('Prato excluído com sucesso!')
    }).catch(err => {
        res.status(400).json(err.message)
    })
})

export default router