import DataTable from "../Base/dataTable/DataTable";
import { GridColDef } from "@mui/x-data-grid";
import { useQuery } from "@tanstack/react-query";
import { getAuthHeaders } from "../../auth/auth";
import { useState } from "react";
import Add from "../Button/AddButton";
import { useParams } from "react-router";

const Category = ({ auth }) => {
    const { id } = useParams(); // Assuming `id` is used for filtering or referencing a category.
    const [open, setOpen] = useState(false);
    const headers = getAuthHeaders(auth.username, auth.password);

    const { isLoading, error, data } = useQuery({
        queryKey: ["all", id],
        queryFn: async () => {
            const response = await fetch(`${process.env.REACT_APP_LINK}/categories/${id}`, {
                headers: headers,
            });
            return await response.json();
        },
    });

    console.log(data);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading categories</div>;

    const columns: GridColDef[] = [
        {
            field: 'id',
            headerName: 'ID',
            width: 100,
        },
        {
            field: 'question_ru',
            headerName: 'Вопрос (RU)',
            width: 300,
        },
        {
            field: 'question_kz',
            headerName: 'Сұрақ (KZ)',
            width: 300,
        },
        {
            field: 'text_ru',
            headerName: 'Ответ (RU)',
            width: 400,
        },
        {
            field: 'text_kz',
            headerName: 'Жауап (KZ)',
            width: 400,
        }
    ];

    return (
        <div className="all">
            <div className="info">
                <h1>Категория:</h1>
                <button onClick={() => setOpen(true)}>Add New Question</button>
            </div>
            <DataTable
                slug="categories"
                columns={columns}
                rows={data?.questions || []}  // Assuming the data has a `questions` array
                auth={auth}
                slug2={{ string: "questions", id: id }}
            />
            {open && <Add slug="questions" columns={columns} setOpen={setOpen} auth={auth} />}
        </div>
    );
};

export default Category;
