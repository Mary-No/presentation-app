import { Alert, Typography, Form, Input, Button, notification, Spin } from "antd"
import { useGetUserPresentationsQuery, useCreatePresentationMutation } from "../../api/presentationApi.ts"
import { useAppSelector } from "../../app/hooks.ts"
import s from './MyPresentations.module.scss'
import Title from "antd/lib/typography/Title"
import {PresentationGallery} from "../PresentationGallery.tsx";
const {  Paragraph } = Typography

export const MyPresentations = () => {
    const [form] = Form.useForm()
    const nickname = useAppSelector((state) => state.user.nickname)

    const { data: userPresentations=[] , isLoading, isFetching , isError: isUserError, refetch } = useGetUserPresentationsQuery(nickname!, {
        skip: !nickname,
    })
    const [createPresentation] = useCreatePresentationMutation()

    const handleCreate = async () => {
        const title = form.getFieldValue("title")
        if (!title?.trim()) return

        try {
            await createPresentation({ title, creatorNickname: nickname! }).unwrap()
            notification.success({ message: "Presentation created" })
            form.resetFields(["title"])
            refetch()
        } catch (err: any) {
            notification.error({
                message: "Error",
                description: err?.data?.error || "Failed to create presentation",
            })
        }
    }

    if (isUserError) {
        return (
            <div style={{ padding: "2rem" }}>
                <Alert message="Error loading presentations" type="error" showIcon />
            </div>
        )
    }

    return (
        <div style={{ marginTop: "2rem" }}>
            <div className={s.createPresentationContainer}>
                <Title className={s.createPresentationTitle} level={4} >Create Presentation</Title>
                <Form
                form={form}
                layout="inline"
                onFinish={handleCreate}
                className={s.createPresentationForm}
            >
                <Form.Item
                    name="title"
                    rules={[{ required: true, message: "Please enter a presentation title" }]}
                    style={{ flexGrow: 1, width: '100%'}}
                >
                    <Input className={s.createPresentationInput} placeholder="New presentation title" />
                </Form.Item>

                <Form.Item className={s.createPresentationBtnItem}>
                    <Button className={s.createPresentationBtn} type="primary" htmlType="submit" >
                        Create
                    </Button>
                </Form.Item>
            </Form>
            </div>

            {isLoading || isFetching ? (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                    <Spin tip="Loading your presentations..." size="large" />
                </div>
            ) : userPresentations.length > 0 ? (
                <PresentationGallery presentations={userPresentations} type="my" />
            ) : (
                <Paragraph>You don't have your own presentations yet.</Paragraph>
            )}
        </div>
    )
}
