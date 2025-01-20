import "./add.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getAuthHeaders } from "../../auth/auth";
import { useState } from "react";
import { GridColDef } from "@mui/x-data-grid";

type Props = {
    slug: string;
    columns: GridColDef[];
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    auth: { username: string; password: string };
    slug2?: { string: string; id: number } | null;  // Optional category info
};

const Add = (props: Props) => {
    const [formData, setFormData] = useState({
        titleKZ: "",
        titleRU: "",
        // Add fields dynamically based on the slug
        questions: [
            {
                questionRU: "",
                questionKZ: "",
                textRU: "",
                textKZ: "",
            },
        ],
    });
    const headers = getAuthHeaders(props.auth.username, props.auth.password);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => {
            const url = props.slug2
                ? `${process.env.REACT_APP_LINK}/admin/categories/${props.slug2.id}/questions`
                : `${process.env.REACT_APP_LINK}/${props.slug}`;
            return fetch(url, {
                method: "post",
                headers: {
                    ...headers,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries([`all${props.slug}`]);
        },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData: any) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        mutation.mutate();
        props.setOpen(false);
    };

    return (
        <div className="add">
            <div className="modal">
                <span className="close" onClick={() => props.setOpen(false)}>
                    X
                </span>
                <h1>
                    {props.slug === "categories"
                        ? "Add New Category"
                        : props.slug === "questions"
                            ? "Add New Question"
                            : `Add new ${props.slug}s`}
                </h1>
                <form onSubmit={handleSubmit}>
                    {props.slug === "categories" ? (
                        <>
                            <div className="item">
                                <label>Category Title (KZ)</label>
                                <input
                                    type="text"
                                    name="titleKZ"
                                    value={formData.titleKZ}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="item">
                                <label>Category Title (RU)</label>
                                <input
                                    type="text"
                                    name="titleRU"
                                    value={formData.titleRU}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    ) : props.slug === "questions" ? (
                        <>
                            <div className="item">
                                <label>Question (KZ)</label>
                                <input
                                    type="text"
                                    name="questions[0].questionKZ"
                                    value={formData.questions[0].questionKZ}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="item">
                                <label>Question (RU)</label>
                                <input
                                    type="text"
                                    name="questions[0].questionRU"
                                    value={formData.questions[0].questionRU}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="item">
                                <label>Text (KZ)</label>
                                <textarea
                                    name="questions[0].textKZ"
                                    value={formData.questions[0].textKZ}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="item">
                                <label>Text (RU)</label>
                                <textarea
                                    name="questions[0].textRU"
                                    value={formData.questions[0].textRU}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Add additional form fields for other slugs */}
                            <div className="item">
                                <label>{props.slug} Title (KZ)</label>
                                <input
                                    type="text"
                                    name="titleKZ"
                                    value={formData.titleKZ}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="item">
                                <label>{props.slug} Title (RU)</label>
                                <input
                                    type="text"
                                    name="titleRU"
                                    value={formData.titleRU}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </>
                    )}

                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
};

export default Add;
