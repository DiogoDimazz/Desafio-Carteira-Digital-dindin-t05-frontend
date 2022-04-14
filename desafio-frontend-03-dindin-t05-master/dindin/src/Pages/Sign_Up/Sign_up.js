import './styles.css';
import Header from '../../components/header';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { getItem } from '../../utils/storage';

export default function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [passwordConfirmation, setPasswordConfirmation] = useState('')
    const [dataWarning, setDataWarning] = useState('')
    const navigate = useNavigate()

    useEffect(() => {
        const token = getItem('token')
        if (token) { navigate('/main') }
    })

    function handleErrorMessage(msg) {
        setDataWarning(msg)

        setTimeout(() => {
            setDataWarning('')
        }, 3000)
        return
    }

    async function handleSubmitSignUp(e) {
        e.preventDefault()

        if (password !== passwordConfirmation) {
            return handleErrorMessage('A senha não confere.')
        }

        try {
            await api.post('/usuario', {
                name,
                email,
                password
            })

        } catch (error) {
            handleErrorMessage(error.response.data.message)
            return console.log(error.response.data.message);
        }

        navigate('/')
    }


    return (
        <div className='body-image'>
            <Header />
            <div className='container-sign-up'>
                {dataWarning &&
                    <div className='data-warning-sign-up'>
                        {dataWarning}
                    </div>
                }
                <form
                    className='container-sign-up-form form-n-modal'
                    onSubmit={handleSubmitSignUp}
                >
                    <h3>Cadastre-se</h3>
                    <div className='input-label'>
                        <label htmlFor='name'>Nome</label>
                        <input
                            id='name'
                            name='name'
                            type='text'
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        ></input>
                    </div>
                    <div className='input-label'>
                        <label htmlFor='email'>E-mail</label>
                        <input
                            id='email'
                            name='email'
                            type='email'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        ></input>
                    </div>
                    <div className='input-label'>
                        <label htmlFor='password'>Senha</label>
                        <input
                            id='password'
                            name='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        ></input>
                    </div>
                    <div className='input-label'>
                        <label htmlFor='password-confirmation'>Confirmação de senha</label>
                        <input
                            id='password-confirmation'
                            name='password-confirmation'
                            type='password'
                            value={passwordConfirmation}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                        ></input>
                    </div>
                    <button className='btn-cadastrar'>Cadastrar</button>
                    <Link to='/' className='link-to-sign-in'>Já tem cadastro? Clique aqui!</Link>
                </form>
            </div>
        </div>
    );
}
