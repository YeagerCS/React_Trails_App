export function MapsIFrame({close}){
    return(
        <>
            <iframe src="https://www.google.com/maps/embed?pb=!1m10!1m8!1m3!1d50119.67799277557!2d8.834891014042144!3d47.191617720605876!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sde!2sch!4v1683882614968!5m2!1sde!2sch" width="600" height="450"></iframe>
            <button onClick={close}>Eat</button>
        </>
    )
}