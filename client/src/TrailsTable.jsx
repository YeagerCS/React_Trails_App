import { useState } from "react";


import Map from "./Map"

export function TrailsTable({ sortByName, sortByDate, t, trails, getFormattedDate, handleDeleteTrails, setSelected, dragDiv }){
    const [displayMap, setDisplayMap] = useState([false, ""])

    function displayMapFR(loc){
        setDisplayMap([true, loc])
    }



    return (
        <>
            {displayMap[0] && <Map location={displayMap[1]} close={() => setDisplayMap([false, ""])} dragDiv={dragDiv}/>}
            <table className="styled-table">
                <thead> 
                    <tr>
                        <th onClick={sortByName}>{t["name"]}<strong>&#8693;</strong></th>
                        <th onClick={sortByDate}>{t["excursionDate"]} <strong>&#8693;</strong></th>
                        <th>{t["time"]}</th>
                        <th>{t["destination"]}</th>
                        <th>Creator</th>
                        <th></th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {trails.map((trail, index) => (
                        <>
                            <tr key={trail.id} className={trail.isCurrent ? "" : "expired"}>
                                <td onClick={e => setSelected(trail)}>{trail.name} <strong>{trail.weather}</strong></td>
                                <td>{getFormattedDate(trail.date.toString())}</td>
                                <td>{trail.time}</td>
                                <td onClick={(e) => displayMapFR(e.target.innerText)}>{trail.destination} 📌</td>
                                <td onClick={(e) => displayMapFR(e.target.innerText)}>{trail.destination} 📌</td>
                                <td><button onClick={e =>  handleDeleteTrails(e, trail.id)} className="btn btn-dark btn-outline-danger">{t["delete"]}</button></td>
                                <td><button onClick={e =>  handleDeleteTrails(e, trail.id)} className="btn btn-dark btn-outline-danger">View</button></td>
                            </tr> 
                        </>
                    ))}
                </tbody>
            </table>    
        </>
    )
}