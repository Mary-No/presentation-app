import {Alert, Input} from "antd";
import {useGetAllPresentationsQuery} from "../api/presentationApi.ts";
import { useState } from "react"
import {PresentationGallery} from "./PresentationGallery.tsx";


export const AllPresentations = () => {
    const [searchQuery, setSearchQuery] = useState("")

    const { data: allPresentations = [], isError: isAllError } = useGetAllPresentationsQuery(
        searchQuery || undefined
    )

    const handleSearch = (value: string) => {
        setSearchQuery(value.trim())
    }

    if (isAllError) {
        return (
            <div style={{ padding: "2rem" }}>
                <Alert message="Error loading presentations" type="error" showIcon />
            </div>
        )
    }

    return (
        <div style={{ marginTop: "3rem" }}>
            <Input.Search
                placeholder="Search presentations"
                onSearch={handleSearch}
                style={{ width: "60%", marginBottom: "1rem" }}
                allowClear
            />

            <PresentationGallery presentations={allPresentations} />
        </div>
    )
}

