import { useState } from "react";

export function TrailsForm(){
    const [trailName, setTrailName] = useState("")
    const [trailDate, setTrailDate] = useState("")

    return(
        <>
            <form className="container">
                <label htmlFor="trailName">Name</label>
                <input type="text" name="trailName" id="trailName"/>
                <label htmlFor="trailDate">Date</label>
                <input type="date" name="trailDate" id="trailDate" />
            </form>
        </>
    )
}