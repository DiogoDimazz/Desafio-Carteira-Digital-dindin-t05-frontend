import { useEffect, useState } from 'react'
import './styles.css'

export default function Resumo({ transactionArray, openModalRegister, setModalType }) {
    const [balance, setBalance] = useState({ credit: 0, debit: 0, total: 0 })

    function calcBalance() {
        let inn = 0
        let out = 0

        transactionArray.forEach((trans) => {
            if (trans.tipo === 'entrada') { return inn += trans.valor; }
            if (trans.tipo === 'saida') { return out += trans.valor }
        })
        setBalance({
            credit: inn,
            debit: out,
            total: (inn - out)
        })
    }


    useEffect(() => {
        calcBalance()
    }, [transactionArray])

    function handleOpenAddRegister() {
        setModalType(true)
        openModalRegister()
    }

    const formattedValue = (v) => {
        const value = (v / 100).toFixed(2)
        return value.replace('.', ',')
    }

    return (
        <div className='resumo'>
            <div className='resumo-card'>
                <strong>Resumo</strong>
                <div className='entrada-div'>
                    <span className='entrada-span'>Entradas</span>
                    <span className='entrada-value-span'>R$ {formattedValue(balance.credit)}</span>
                </div>
                <div className='saida-div'>
                    <span className='saida-span'>Saídas</span>
                    <span className='saida-value-span'>R$ {formattedValue(balance.debit)}</span>
                </div>
                <div className='short-horizontal-line'></div>
                <div className='saldo-div'>
                    <span className='saldo-span'>Saldo</span>
                    <span className='saldo-value-span'>R$ {formattedValue(balance.total)}</span>
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