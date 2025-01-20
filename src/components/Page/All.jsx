import DataTable from "../Base/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import {useQuery} from "@tanstack/react-query";
import {getAuthHeaders} from "../../auth/auth";
import {useState} from "react";
import Add from "../Button/AddButton";
const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
        field: "title_kz",
        headerName: "Title (KZ)",
        type: "string",
        width: 200,
    },
    {
        field: "title_ru",
        headerName: "Title (RU)",
        type: "string",
        width: 200,
    },
    {
        field: "questions",
        headerName: "Questions(Number)",
        width: 150,
        renderCell: (params) => `${params.row.questions?.length || 0} questions`,
    }
];
const All = ({auth}) => {
    const [open, setOpen] = useState(false);
    const headers = getAuthHeaders(auth.username, auth.password);
    const { isLoading, data } = useQuery({
      queryKey: ["all"],
      queryFn: () =>
        fetch(`${process.env.REACT_APP_LINK}/categories`,{
            headers :headers
        }).then(
          (res) => res.json()
        ),
    });
return (
    <div className="all">
        <div className="info">
            <h1>All Questions and Categories</h1>
            <button onClick={() => setOpen(true)}>Add New Category</button>
        </div>
        {isLoading ? (
            "Loading..."
        ) : (
            <DataTable slug="categories" columns={columns} rows={data} auth = {auth}  slug2={null}/>
      ) }
        {open && <Add slug="categories" columns={columns} setOpen={setOpen} auth = {auth} />}
    </div>
)
}
export default All;