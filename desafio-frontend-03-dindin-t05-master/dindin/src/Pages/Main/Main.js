import './styles.css'
import Header from '../../components/header'
import Transacao from '../../components/Transacao/transacao'
import Resumo from '../../components/Resumo/Resumo'
import filterIcon from '../../assets/filtrar_icon.svg'
import dateUpArrow from '../../assets/data_up_arrow.svg'
import { useEffect, useState } from 'react'
import { getItem } from '../../utils/storage'
import api from '../../services/api'
import ModalRegister from '../../components/modal_registro/modal_register'
import FilterBox from '../../components/filter_box/filter_box'
import UserModal from '../../components/modal_user/modal_user'


export default function Main() {
    const [deleteBoxOpen, setDeleteBoxOpen] = useState(false)
    const [transactionArray, setTransactionArray] = useState([])
    const [transactionData, setTransactionData] = useState({})
    const [user, setUser] = useState({ id: null, name: '', email: '' })
    const [openFilter, setOpenFilter] = useState(false)
    const [showModalRegister, setShowModalRegister] = useState(false)
    const [showModalUser, setShowModalUser] = useState(false)
    const [categoryList, setCategoryList] = useState([])
    const [modalType, setModalType] = useState(null)
    const [resetPage, setResetPage] = useState(false)
    const token = getItem('token')


    async function fillUserData(res, req) {
        try {
            const response = await api.get('/usuario',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
            return setUser({ ...response.data })
        } catch (error) {
            return res.status(400).json(error.response.data.message)
        }
    }

    async function fetchCategoryList(req, res) {

        try {
            const response = await api.get('/categoria', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCategoryList(response.data)
            setResetPage(!resetPage)
        } catch (error) {
            res.status(400).json(error.response.data.message)
        }
    }

    async function createTransactionArray(req, res) {
        try {
            const response = await api.get('/transacao',
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

            setTransactionArray(response.data);
        } catch (error) {
            return res.status(400).json(error.response.data.message)
        }
    }

    function openModalRegister() {
        setShowModalRegister(true)
    }


    useEffect(() => {
        console.log('useEffect 1 the Main - Só na Montagem');
        fetchCategoryList()

        return () => {
        }
    }, [])

    useEffect(() => {
        if (!showModalRegister) {
            console.log('useEffect 2 - transaction array');
            createTransactionArray()
        }
        if (!showModalUser) {
            console.log('useEffect 3 the Main - user data');
            fillUserData()
        }

        return () => {
        }
    }, [resetPage])

    return (
        <div className='body-clean'>
            <Header
                token={token}
                userName={user.nome}
                setShowModalUser={setShowModalUser}
            />
            <div className='container-main'>
                <button
                    className='filter-btn'
                    onClick={() => setOpenFilter(!openFilter)}
                >
                    <img src={filterIcon} alt='icon' />
                    Filtrar
                </button>
                <div className='inner-container'>
                    {openFilter &&
                        <FilterBox
                            categoryList={categoryList}
                        />
                    }
                    <div className='second-inner-container'>
                        <div className='left-inner-container'>
                            <div className='transaction-label'>
                                <div className='label-data'>
                                    <span className='date label'>
                                        Data
                                        <img src={dateUpArrow} alt='arrow up' />
                                    </span>
                                </div>
                                <div className='label-dia label'>
                                    <span className='dia'>Dia da semana</span>
                                </div>
                                <div className='label-descricao label'>
                                    <span className='descricao'>Descrição</span>
                                </div>
                                <div className='label-categoria label'>
                                    <span className='categoria'>Categoria</span>
                                </div>
                                <div className='label-valor label'>
                                    <span className='valor'>Valor</span>
                                </div>
                            </div>
                            <div>
                                {transactionArray.map((data) => (
                                    <Transacao
                                        key={data.id}
                                        token={token}
                                        transData={data}
                                        setTransactionData={setTransactionData}
                                        createTransactionArray={createTransactionArray}
                                        deleteBoxOpen={deleteBoxOpen}
                                        setDeleteBoxOpen={setDeleteBoxOpen}
                                        setModalType={setModalType}
                                        openModalRegister={openModalRegister}
                                        categoryList={categoryList}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className='right-inner-container'>
                            <Resumo
                                token={token}
                                openModalRegister={openModalRegister}
                                setModalType={setModalType}
                            />
                        </div>
                    </div>
                </div>
            </div>
            {showModalUser &&
                <UserModal
                    setShowModalUser={setShowModalUser}
                    user={user}
                    setUser={setUser}
                    token={token}
                    resetPage={resetPage}
                    setResetPage={setResetPage}
                />
            }
            {showModalRegister &&
                <ModalRegister
                    setShowModalRegister={setShowModalRegister}
                    modalType={modalType}
                    transactionData={transactionData}
                    categoryList={categoryList}
                    token={token}
                    resetPage={resetPage}
                    setResetPage={setResetPage}
                />
            }
        </div>

    )
}
