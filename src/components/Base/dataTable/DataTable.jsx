import "./dataTable.scss";
import { Link } from "react-router-dom";
import { DataGrid, GridColDef, GridToolbar } from "@mui/x-data-grid";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthHeaders } from "../../../auth/auth";

type Props = {
    columns: GridColDef[];
    rows: object[];
    slug: string;
    slug2?: { string: string; id: number } | null;
    auth: { username: string; password: string };
};

const DataTable = (props: Props) => {
    const headers = getAuthHeaders(props.auth.username, props.auth.password);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => {
            const url = props.slug2
                ? `${process.env.REACT_APP_LINK}/admin/categories/${props.slug2.id}/questions/${id}`
                : `${process.env.REACT_APP_LINK}/${props.slug}/${id}`;
            return fetch(url, {
                method: "delete",
                headers: headers,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries([`all`, props.slug]);
        },
    });

    const handleDelete = (id: number) => {
        mutation.mutate(id);
    };

    const actionColumn: GridColDef = {
        field: "action",
        headerName: "Action",
        width: 200,
        renderCell: (params) => {
            const viewLink = props.slug2
                ? `/admin/categories/${props.slug2.id}/questions/${params.row.id}`
                : `/admin/${props.slug}/${params.row.id}/`;
            return (
                <div className="action">
                    <Link to={viewLink}>
                        <img src="/view.svg" alt="view" />
                    </Link>
                    <div className="delete" onClick={() => handleDelete(params.row.id)}>
                        <img src="/delete.svg" alt="delete" />
                    </div>
                </div>
            );
        }
    };

    return (
        <div className="dataTable">
            <DataGrid
                className="dataGrid"
                rows={props.rows || []}
                columns={[...props.columns, actionColumn]}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 10,
                        },
                    },
                }}
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                    toolbar: {
                        showQuickFilter: true,
                        quickFilterProps: { debounceMs: 500 },
                    },
                }}
                pageSizeOptions={[5, 10, 20]}  // Provide multiple page size options
                checkboxSelection
                disableRowSelectionOnClick
                disableColumnFilter
                disableDensitySelector
                disableColumnSelector
            />
        </div>
    );
};

export default DataTable;
