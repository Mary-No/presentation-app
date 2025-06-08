import { useState } from 'react';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import { Button, Form, Input, notification, Spin } from 'antd';
import { useAppDispatch } from '../app/hooks';
import { setNickname } from '../api/userSlice';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';
import { useRegisterUserMutation } from '../api/authApi';

export const JoinPage = () => {
    const [form] = Form.useForm();
    const [registerUser] = useRegisterUserMutation();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onFinish = async (values: { nickname: string }) => {
        try {
            setIsSubmitting(true);
            await registerUser({ nickname: values.nickname }).unwrap();
            localStorage.setItem('nickname', values.nickname);
            dispatch(setNickname(values.nickname));
            navigate(`/presentations`);
        } catch (err: any) {
            const errorMessage =
                err?.data?.message || err?.data?.error || err?.error || 'Failed to register nickname';

            notification.error({
                message: 'Registration Error',
                description: errorMessage,
                placement: 'topRight',
                duration: 3
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <ParticlesBackground/>
            <main style={{position: 'relative', zIndex: 1}}>
                <div
                    style={{
                        maxWidth: 400,
                        margin: '80px auto',
                        padding: 24,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        borderRadius: 8,
                        backgroundColor: "white",
                    }}
                >
                    <Title level={2}>Collaborative Presentations</Title>
                    <Paragraph style={{textAlign:"center"}}>
                        Start creating and editing presentations in real time
                    </Paragraph>

                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={onFinish}
                        autoComplete="off"
                        requiredMark={false}
                    >
                        <Form.Item
                            label="Nickname"
                            name="nickname"
                            rules={[{ required: true, message: 'Nickname is required' }]}
                        >
                            <Input placeholder="Enter your nickname" />
                        </Form.Item>

                        <Form.Item>
                            <Button color="cyan" variant="solid" htmlType="submit" block disabled={isSubmitting}>
                                {isSubmitting ? <Spin size="small" /> : 'Join'}
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
            </main>
        </div>

    );
};
