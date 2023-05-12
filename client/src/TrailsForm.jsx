import { useEffect, useState } from "react";
import { isAfter, isBefore, setDate } from 'date-fns'
import { weatherSymbols } from "./weatherSymbols";
import Dialog from "./Dialog";
const apikey = "621e2c097166ed6ba8f64cbed0173994"


export function TrailsForm(){
    const [trailName, setTrailName] = useState("")
    const [trailDate, setTrailDate] = useState("")
    const [trailTime, setTrailTime] = useState("")
    const [displayDialog, setDisplayDialog] = useState(false)
    const [datesSorted, setDatesSorted] = useState(true)
    const [namesSorted, setNamesSorted] = useState(false)

    const [trails, setTrails] = useState(() => {
       if(localStorage.getItem("TRAILS")){
        const trailsState = JSON.parse(localStorage.getItem("TRAILS"))
        let sortedTrails = trailsState.sort((x, y) => (
          new Date(y.date) - new Date(x.date)
        ));

        return checkExpiration(sortedTrails)
       } 
       return []
    })

    function getFormattedDate(stringDate){
        const currentDate = new Date(stringDate)
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1;
        const year = currentDate.getFullYear();
        const formattedDate = `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`;
      
        return formattedDate;
    }

    function checkExpiration(inpTrails){
        const updatedTrails = inpTrails.map(trail => {
            if (isAfter(new Date(), new Date(trail.date))) {
              return { ...trail, isCurrent: false };
            } else {
              return trail;
            }
        });
        return updatedTrails;
    }

    function getCurrentLocation() {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            error => {
              reject(error);
            }
          );
        });
    }

    function fetchWeather(date, time) {
        const unixTimestamp = "1970-01-01T";

        const selectedDate = new Date(date);
        const selctedTime = new Date(unixTimestamp + time + ":00")
        const timestamp = Math.floor((selectedDate.getTime() + selctedTime.getTime()) / 1000);
        return getCurrentLocation()
          .then(location => {
            const { latitude, longitude } = location;
            console.log(latitude, longitude, timestamp)
            const url = "https://api.openweathermap.org/data/2.5/weather?lat=" + latitude + "&lon=" + longitude + "&dt="+ timestamp +"&appid=" + apikey;
      
            return fetch(url)
              .then(response => response.json())
              .then(data => {
                return data.weather[0].main;
              });
        })
          .catch(error => {
            console.error(error);
        });
    }

    async function getWeatherStr(date, time){
        try{
            const weather = await fetchWeather(date, time);
            return weather;
        } catch(error){
            console.error(error);
        }
    }


    async function handleAddTrails(e){
        const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
        const dateValid = isAfter(new Date(trailDate), new Date())
        const timeValid = timeRegex.test(trailTime)

        e.preventDefault()
        if(dateValid && timeValid){
            const weatherStr = await getWeatherStr(trailDate, trailTime)
            console.log(weatherStr);
            setTrails(current => {
                return [
                    ...current,
                    {id: crypto.randomUUID(), name: trailName, date: trailDate, isCurrent: true, time: trailTime, weather: weatherSymbols[weatherStr]}
                ];
            })
    
            setTrails(current => sortDates([...current]))
            setTrailDate("")
            setTrailName("")
            setTrailTime("")
        } else{
            const dateInvalidity = dateValid ? "" : "Date can't be in the past"
            const timeInvalidity = timeValid ? "" : "Invalid time format" 
            const error = dateInvalidity + "" + (timeInvalidity && dateInvalidity && " / ") + timeInvalidity
            setDisplayDialog([true, error])
        }

    }

    function handleDeleteTrails(e, id){
        e.preventDefault()
        setTrails(current => {
            return current.filter(trail => trail.id !== id)
        })
    }

    useEffect(() => {
        localStorage.setItem("TRAILS", JSON.stringify(trails))
    }, [trails])

    function sortByDate(){
        if(datesSorted){
            setTrails(current => {
                return sortDatesDESC([...current])
            });
            setDatesSorted(false)
        } else{
            setTrails(current => {
                return sortDates([...current])
            });
            setDatesSorted(true)
        }
    }

    function sortDates(current){
        const sortedTrails = current.sort((x, y) => (
            new Date(y.date) - new Date(x.date)
        ));
        return sortedTrails;
    }

    function sortDatesDESC(current){
        const sortedTrails = current.sort((x, y) => (
            new Date(x.date) - new Date(y.date)
        ));
        return sortedTrails;
    }

    function sortByName(e){
        e.preventDefault()
        if(namesSorted){
            setTrails(current => [...current].sort((a, b) => a.name.localeCompare(b.name)))
            setNamesSorted(false)
        } else{
            setTrails(current => [...current].sort((a, b) => b.name.localeCompare(a.name)))
            setNamesSorted(true)
        }
    }

    useEffect(() => {
        const lastUpdate = localStorage.getItem("LAST_W_UPDATE")

        //Checks if there was a last update or calculates the difference of the last update and current time
        if(!lastUpdate || (new Date() - new Date(lastUpdate)) >= 24 * 60 * 60 * 1000){ //if more than 24 hours have passed since lastUpdate, a new update occurs
            updateWeather().then(updatedTrails => {
                setTrails(updatedTrails)
                localStorage.setItem("LAST_W_UPDATE", new Date().toISOString());
            })
        }
        
    }, [trails])

    async function updateWeather(){
       const updatedTrails = await Promise.all(trails.map(async trail =>{
        const weatherStr = await getWeatherStr(trail.date, trail.time)
        return {
            ...trail,
            weather: weatherSymbols[weatherStr]
        }
       }))

       return updatedTrails;
    }

    return(
        <>
            {displayDialog[0] && <Dialog closeAlert={() => setDisplayDialog([false, []])} message={displayDialog[1]}/>}
            <div className="mainDiv container">
            <div className="d-flex flex-row justify-content-between flex-wrap">
                <form className="flex-grow-1 gap-1 flex-column d-flex me-5 mt-2">
                <label htmlFor="trailName">Name</label>
                <input type="text" name="trailName" id="trailName" className="boxStyle" value={trailName} onChange={e => setTrailName(e.target.value)}/>
                <label htmlFor="trailDate">Ausflugsdatum</label>
                <input type="date" name="trailDate" id="trailDate" className="boxStyle" value={trailDate} onChange={e => setTrailDate(e.target.value)}/>
                <label htmlFor="trailTime">Zeit</label>
                <input type="text" name="trailTime" id="trailTime" placeholder="00:00..." className="boxStyle" value={trailTime} onChange={e => setTrailTime(e.target.value)}/>
                <button className="btnStyle" onClick={handleAddTrails}>Submit</button>
                </form>
                <table className="styled-table">
                    <thead>
                        <tr>
                            <th onClick={sortByName}>Name<strong>&#8693;</strong></th>
                            <th onClick={sortByDate}>Ausflugsdatum <strong>&#8693;</strong></th>
                            <th>Time</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {trails.map((trail, index) => (
                            <>
                                <tr key={trail.id} className={trail.isCurrent ? "" : "expired"}>
                                    <td>{trail.name} <strong>{trail.weather}</strong></td>
                                    <td>{getFormattedDate(trail.date.toString())}</td>
                                    <td>{trail.time}</td>
                                    <td><button onClick={e =>  handleDeleteTrails(e, trail.id)} className="btn btn-dark btn-outline-danger">Delete</button></td>
                                </tr> 
                            </>
                        ))}
                    </tbody>
                </table>    
            </div>
            </div>
        </> 
    )
}