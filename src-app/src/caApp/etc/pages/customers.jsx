import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API } from "../api";

function CustomersTemplate({ data }) {
    return (<>
        <div>
            {data?.name}<br />
            {data?.invoices - data.receipts}

        </div>
    </>)
}

function Customers() {
    let { _sid } = useParams();
    let [data, _data_] = useState({})
    useEffect(() => {
        API.get(`/customers/${_sid}/`).then((response) => {
            _data_(response.data);
        })
    }, [_sid])
    return (
        <>
            {data?.customers && data?.customers?.map(customer => {
                return <CustomersTemplate data={customer} />
            })}
        </>
    )
}

export { Customers }


