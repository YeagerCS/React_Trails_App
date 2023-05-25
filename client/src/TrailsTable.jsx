export function TrailsTable({ sortByName, sortByDate, t, trails, getFormattedDate, handleDeleteTrails, setSelected }){
    return (
        <table className="styled-table">
            <thead>
                <tr>
                    <th onClick={sortByName}>{t["name"]}<strong>&#8693;</strong></th>
                    <th onClick={sortByDate}>{t["excursionDate"]} <strong>&#8693;</strong></th>
                    <th>{t["time"]}</th>
                    <th>{t["destination"]}</th>
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
                            <td>{trail.destination}</td>
                            <td><button onClick={e =>  handleDeleteTrails(e, trail.id)} className="btn btn-dark btn-outline-danger">{t["delete"]}</button></td>
                        </tr> 
                    </>
                ))}
            </tbody>
        </table>    
    )
}