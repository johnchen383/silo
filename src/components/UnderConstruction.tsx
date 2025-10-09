import { useEffect } from 'react'
import construction from '../assets/construction.svg'
import "./UnderConstruction.scss"
import { useAppProvider } from '../providers/app_provider'

const UnderConstruction = () => {
    const {setInApp} = useAppProvider();
    
    useEffect(() => {
        setInApp(true);
    }, [])

    return (
        <div className='construction'>
            <img src={construction} />
            <div className="caption"><b>Page under construction</b></div>
            <div className="label">We're fine-tuning every pixel and tightening every bolt to bring you a page worth the wait 🚀</div>
        </div>
    )
}

export default UnderConstruction