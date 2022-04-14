import './styles.css'
import closeBtn from '../../assets/close_btn.svg'
import { useEffect, useState } from 'react'
import downArrowSelect from '../../assets/down_arrow.svg'
import { format } from 'date-fns'
import api from '../../services/api'

export default function ModalRegister({
    setShowModalRegister,
    modalType,
    transactionData,
    categoryList,
    token,
    resetPage,
    setResetPage
}) {
    const [entryType, setEntryType] = useState(true)
    const [showCategoryList, setShowCategoryList] = useState(false)
    const [dataWarning, setDataWarning] = useState('')
    const [valueToShow, setValueToShow] = useState('')
    const [dateToShow, setDateToShow] = useState('')
    const [currentIdTransaction, setCurrentIdTransaction] = useState(0)
    const [readyToFill, setReadyToFill] = useState(false)
    const [categoryToShow, setCategoryToShow] = useState('')
    const [form, setForm] = useState({
        tipo: 'entrada',
        valor: '',
        categoria: '',
        categoria_id: null,
        data: '',
        descricao: ''
    })

    function handleErrorMessage(msg) {
        setDataWarning(msg)

        setTimeout(() => {
            setDataWarning('')
        }, 3000)
        return
    }

    async function handleAddRegister(e) {
        e.preventDefault()

        if (!parseInt(form.data)) {
            return handleErrorMessage('Data inválida. Utilizar somente números')
        }
        if (form.data.length !== 6) {
            return handleErrorMessage('Data inválida. Favor preencher com 6 dígitos.')
        }

        const splitData = form.data.split('')
        const stringData = `${splitData[4]}${splitData[5]}${splitData[2]}${splitData[3]}${splitData[0]}${splitData[1]}`

        try {
            await api.post('/transacao', {
                description: form.descricao,
                amount: parseInt(form.valor),
                date: stringData,
                idcategory: form.categoria_id,
                type: form.tipo
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

        } catch (error) {
            handleErrorMessage(error.response.data.message)
            return console.log(error.response.data.message);
        }

        setShowModalRegister(false)
        setResetPage(!resetPage)
    }

    async function fetchTransactionData(res, req) {
        try {
            const response = await api.get(`transacao/${transactionData.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })


            const e = response.data[0].data
            const newDateString = `${e.slice(8, 10)}${e.slice(5, 7)}${e.slice(2, 4)}`

            setForm({
                tipo: response.data[0].tipo,
                valor: (response.data[0].valor).toString(),
                categoria: response.data[0].categoria_nome,
                categoria_id: response.data[0].categoria_id,
                data: newDateString,
                descricao: response.data[0].descricao
            })
            setCurrentIdTransaction(response.data[0].id)

            setReadyToFill(true)

        } catch (error) {
            res.status(400).json(error.response.data.message)
        }
    }

    async function handleEditRegister(e) {
        e.preventDefault()

        console.log(currentIdTransaction);


        if (!parseInt(form.data)) {
            return handleErrorMessage('Data inválida. Utilizar somente números')
        }
        if (form.data.length !== 6) {
            return handleErrorMessage('Data inválida. Favor preencher com 6 dígitos.')
        }

        const splitData = form.data.split('')
        const stringData = `${splitData[4]}${splitData[5]}${splitData[2]}${splitData[3]}${splitData[0]}${splitData[1]}`


        try {
            await api.put(`/transacao/${currentIdTransaction}`, {
                description: form.descricao,
                amount: form.valor,
                date: stringData,
                idcategory: form.categoria_id,
                type: form.tipo
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
        } catch (error) {
            handleErrorMessage(error.response.data.message)
            return console.log(error.response.data.message);
        }

        setShowModalRegister(false)
        setResetPage(!resetPage)
    }

    function entryTypeEntrada() {
        setEntryType(true)
        setForm({ ...form, tipo: 'entrada' })
    }

    function entryTypeSaida() {
        setEntryType(false)
        setForm({ ...form, tipo: 'saida' })
    }


    function handleValue(e) {
        setValueToShow(e)
        setForm({ ...form, valor: e })
    }

    function handleFormatValue(e) {
        const rawValue = ((e / 100).toFixed(2)).toString()
        setValueToShow(rawValue.replace('.', ','))
    }

    function openCategoryList() {
        setShowCategoryList(!showCategoryList)
    }

    function handleSelectCategory(cat) {
        setForm({ ...form, categoria: cat })
        setCategoryToShow(cat)
        const category = categoryList.find((c) => {
            return c.descricao === cat
        })
        setForm({ ...form, categoria_id: category.id })
        setShowCategoryList(false)
    }

    function handleDate(e) {
        if (form.data.length >= 6) {
            const adjustData = e.slice(1)
            setForm({ ...form, data: adjustData })
            setDateToShow(adjustData)
            return
        }
        setForm({ ...form, data: e })
        setDateToShow(e)
    }

    function handleDateFormat(e) {
        const newDateString = `${e.slice(0, 2)}/${e.slice(2, 4)}/${e.slice(4)}`
        setDateToShow(newDateString)
    }

    useEffect(() => {
        console.log('useEffect 3 do modal_register');
        if (readyToFill) {
            if (form.tipo === 'entrada') { setEntryType(true) } else { setEntryType(false) }
            handleFormatValue(form.valor)
            handleSelectCategory(form.categoria)
            handleDateFormat(form.data)
            setReadyToFill(false)
        }

        return () => {
            console.log('desmontei o useEffect 3 do modal_register');
        }
    }, [readyToFill])


    useEffect(() => {
        if (modalType) { return }
        fetchTransactionData()

        return () => {
            console.log('desmontei o useEffect 1 do modal_register');
        }

    }, [])


    return (

        <div className='container-register'>
            <form
                className='register-form'
                onSubmit={modalType
                    ? (e) => handleAddRegister(e)
                    : (e) => handleEditRegister(e)
                }
            >
                <div className='form-header'>
                    <h1>{modalType
                        ? 'Adicionar Registro'
                        : 'Editar Registro'
                    }</h1>
                    <img
                        src={closeBtn}
                        className='close-btn'
                        onClick={() => setShowModalRegister(false)}
                    />
                </div>
                <div className='btn-form-div'>
                    <button
                        type='button'
                        className='entrada-btn'
                        onClick={() => entryTypeEntrada()}
                        style={entryType
                            ? { backgroundColor: 'rgb(58, 159, 241)' }
                            : { backgroundColor: 'rgb(185, 185, 185)' }}
                    >
                        Entrada</button>
                    <button
                        type='button'
                        className='saida-btn'
                        onClick={() => entryTypeSaida()}
                        style={entryType
                            ? { backgroundColor: 'rgb(185, 185, 185)' }
                            : { backgroundColor: 'rgb(255, 87, 107)' }}
                    >
                        Saída</button>
                </div>
                <div className='form-content'>
                    <label htmlFor='valor'>
                        {dataWarning &&
                            <div className='data-warning-modal'>
                                {dataWarning}
                            </div>
                        }
                        Valor
                    </label>
                    <input
                        id='valor'
                        name='valor'
                        type='text'
                        value={valueToShow}
                        onChange={(e) => handleValue(e.target.value)}
                        onBlur={(e) => handleFormatValue(e.target.value)}
                        onFocus={() => setValueToShow(form.valor)}
                    />
                    <div className='category-select-box'>
                        <label htmlFor='categoria'>Categoria</label>
                        <div
                            id='categoria'
                            name='categoria'
                            className='select-box'
                        >
                            {categoryToShow}
                        </div>

                        <img
                            src={downArrowSelect}
                            onClick={openCategoryList}
                            className='down-arrow-select'
                        />
                        {showCategoryList &&
                            <ul
                                className='category-list'
                            >
                                {categoryList.map((category) => (
                                    <li
                                        key={category.id}
                                        onClick={(e) => handleSelectCategory(e.target.textContent)}
                                        className='li-category'
                                    >{category.descricao}</li>
                                ))}

                            </ul>
                        }
                    </div>
                    <label htmlFor='data'>Data</label>
                    <input
                        id='data'
                        name='data'
                        type='text'
                        value={dateToShow}
                        onChange={(e) => handleDate(e.target.value)}
                        onBlur={(e) => handleDateFormat(e.target.value)}
                        onFocus={() => setDateToShow(form.data)}
                    />
                    <label htmlFor='descricao'>Descrição</label>
                    <textarea
                        id='descricao'
                        name='descricao'
                        type='text'
                        value={form.descricao}
                        className='descricao-area'
                        onChange={(e) => setForm({ ...form, descricao: e.target.value })}
                    />
                </div>
                <div className='btn-div'>
                    <button
                        className='submit-btn'
                    >Confirmar</button>
                </div>
            </form>
        </div>
    )
}