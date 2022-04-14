import { useEffect, useState } from 'react'
import './styles.css'
import api from '../../services/api'

export default function Resumo({ token, openModalRegister, setModalType }) {
    const [balance, setBalance] = useState({ credit: 0, debit: 0, total: 0 })

    const setComma = (v) => {
        const value = (v / 100).toFixed(2)
        return value.replace('.', ',')
    }

    const adjustValues = (values) => {
        const localCredit = setComma(values.entrada)
        const localDebit = setComma(values.saida)
        const localBalance = setComma((parseInt(values.entrada) + parseInt(values.saida)).toString())
        setBalance({
            credit: localCredit,
            debit: localDebit,
            total: localBalance
        })
    }

    async function getBalance(req, res) {

        try {
            const response = await api.get('/transacao/extrato', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            adjustValues(response.data)
        } catch (error) {
            return res.status(400).json(error.response.data.message)
        }
    }



    function handleOpenAddRegister() {
        setModalType(true)
        openModalRegister()
    }


    useEffect(() => {
        console.log('useEffect the Resumo');
        getBalance()
    }, [])

    return (
        <div className='resumo'>
            <div className='resumo-card'>
                <strong>Resumo</strong>
                <div className='entrada-div'>
                    <span className='entrada-span'>Entradas</span>
                    <span className='entrada-value-span'>R$ {balance.credit}</span>
                </div>
                <div className='saida-div'>
                    <span className='saida-span'>Saídas</span>
                    <span className='saida-value-span'>R$ {balance.debit}</span>
                </div>
                <div className='short-horizontal-line'></div>
                <div className='saldo-div'>
                    <span className='saldo-span'>Saldo</span>
                    <span className='saldo-value-span'>R$ {balance.total}</span>
                </div>
            </div>
            <button
                className='resumo-btn'
                onClick={handleOpenAddRegister}
            >
                Adicionar Registro</button>
        </div>
    )
}