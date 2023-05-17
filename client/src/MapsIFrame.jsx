export function MapsIFrame({close}){
    return(
        <>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2711.025474967532!2d8.854666276704325!3d47.19651391620564!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x479ab61244e4b83f%3A0x3b32a4b1a97f31a8!2sBirkenstrasse%2010%2C%208853%20Lachen!5e0!3m2!1sde!2sch!4v1683882958669!5m2!1sde!2sch" width="400" height="300"></iframe>
            <button onClick={close}>Close</button>
        </>
    )
}