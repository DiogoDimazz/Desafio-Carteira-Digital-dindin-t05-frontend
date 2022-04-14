import './styles.css'
import logo from '../../assets/logo.svg'
import userIcon from '../../assets/user_icon.svg'
import unlogBtn from '../../assets/unlog_btn.svg'
import { clearStorage } from '../../utils/storage'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'


export default function Header({ token, userName, setShowModalUser }) {
    const navigate = useNavigate()
    const [firstName, setFirstName] = useState('')

    function LogOff() {
        clearStorage()
        navigate('/')
        return
    }

    useEffect(() => {
        if (!userName) return;
        const separatedName = userName.split(' ')
        setFirstName(separatedName[0])

        return () => {
        }
    })

    return (
        <header>
            <div className='header-logo'>
                <img src={logo} alt='logo' />
                <h2>Dindin</h2>
            </div>
            {token &&
                <div className='header-usuario'>
                    <img
                        src={userIcon}
                        alt='User Icon'
                        className='user-icon'
                        onClick={() => setShowModalUser(true)}
                    />
                    <span>{firstName}</span>
                    <img
                        src={unlogBtn}
                        alt='Exit'
                        className='log-off-btn'
                        onClick={LogOff}
                    />
                </div>
            }
        </header>
    )
}
