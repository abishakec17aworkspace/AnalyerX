import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const LoginPage = () => {

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleLogin = () => {
        login()
        navigate('/dashboard')
    }

    return (

        <button onClick={handleLogin}>
            Login
        </button>

    )
}

export default LoginPage