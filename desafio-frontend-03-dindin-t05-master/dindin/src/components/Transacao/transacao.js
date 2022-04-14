import './styles.css'
import editIcon from '../../assets/edit_icon.svg'
import deleteIcon from '../../assets/delete_icon.svg'
import { useEffect, useState } from 'react'
import { format, getDay, parseISO } from 'date-fns'
import api from '../../services/api'


export default function Transacao({
    token,
    transData,
    setTransactionData,
    createTransactionArray,
    deleteBoxOpen,
    setDeleteBoxOpen,
    setModalType,
    openModalRegister,
    categoryList
}) {

    const [localDeleteBox, setLocalDeleteBox] = useState(deleteBoxOpen)
    const [weekDay, setWeekDay] = useState('')
    const [formattedDate, setFormattedDate] = useState('')
    const [currentCategory, setCurrentCategory] = useState('')
    const [localDescription, setLocalDescription] = useState('')


    function handleDeleteConfirmation() {
        if (deleteBoxOpen) return;
        setDeleteBoxOpen(true);
        setLocalDeleteBox(true);
    }

    function handleDeleteCancel() {
        setDeleteBoxOpen(false)
        setLocalDeleteBox(false)
    }

    async function handleDeleteTransaction(res, req) {

        try {
            await api.delete(`/transacao/${transData.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            return res.status(400).json(error.response.data.message)
        }

        setDeleteBoxOpen(false)
        setLocalDeleteBox(false)
        createTransactionArray()
    }

    function dateInfo(date) {
        const timeDate = parseISO(date)
        setFormattedDate(format(timeDate, 'dd/MM/yy'))

        const weekDayNumber = getDay(timeDate)

        if (weekDayNumber === 0) { setWeekDay('Domingo') }
        if (weekDayNumber === 1) { setWeekDay('Segunda-Feira') }
        if (weekDayNumber === 2) { setWeekDay('Terça-Feira') }
        if (weekDayNumber === 3) { setWeekDay('Quarta-Feira') }
        if (weekDayNumber === 4) { setWeekDay('Quinta-Feira') }
        if (weekDayNumber === 5) { setWeekDay('Sexta-Feira') }
        if (weekDayNumber === 6) { setWeekDay('Sábado') }

    }

    function categoryDescription() {

        const categoryName = categoryList.find((c) => {
            return c.id === transData.categoria_id
        })

        setCurrentCategory(categoryName.descricao)
    }

    const tipoTransacao = () => {
        if (transData.tipo === 'entrada') {
            return true
        }
        if (transData.tipo === 'saida') {
            return false
        }
    }

    const formattedValue = () => {
        const valor = (transData.valor / 100).toFixed(2)
        return valor.replace('.', ',')
    }

    function handleEditModal() {
        setModalType(false)
        setTransactionData({ ...transData })
        openModalRegister()
    }

    useEffect(() => {
        return () => {
        }
    }, [currentCategory])

    useEffect(() => {
        categoryDescription()
        return () => {
        }
    }, [weekDay])

    useEffect(() => {
        dateInfo(transData.data)
        setLocalDescription(transData.descricao)
        return () => {
        }
    }, [])

    return (
        <div>
            <div className='transaction-row'>
                <span
                    className='info-data info'
                >{formattedDate}</span>
                <span
                    className='info-dia info'
                >{weekDay}</span>
                <span
                    className='info-descricao info'
                >{localDescription}</span>
                <span
                    className='info-categoria info'
                >{currentCategory}</span>
                <span
                    className='info-valor info'
                    style={tipoTransacao() ? { color: 'rgb(123, 97, 255)' } : { color: 'rgb(250, 140, 16)' }}
                >{formattedValue()}</span>
                <img
                    src={editIcon}
                    alt='edit'
                    className='edit-icon'
                    onClick={handleEditModal}
                />
                <img
                    src={deleteIcon}
                    alt='delete'
                    className='delete-icon'
                    onClick={handleDeleteConfirmation}
                    id='click-event'
                />
                {localDeleteBox &&
                    <div>
                        <div className='delete-confirmation'>
                            <span className='delete-question'>Apagar item?</span>
                            <div className='delete-confirmation-btns'>
                                <button
                                    className='sim-delete'
                                    onClick={handleDeleteTransaction}
                                >
                                    Sim</button>
                                <button
                                    className='nao-delete'
                                    onClick={handleDeleteCancel}
                                >
                                    Não</button>
                            </div>
                        </div>
                    </div>
                }
            </div>
            <div className='horizontal-line'></div>
        </div >
    )
}