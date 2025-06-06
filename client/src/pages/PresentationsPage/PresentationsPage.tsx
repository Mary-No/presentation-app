import { Tabs } from "antd";
import { MyPresentations } from "../../components/MyPresentations/MyPresentations.tsx";
import { AllPresentations } from "../../components/AllPresentations.tsx";
import styles from './PresentationsPage.module.scss';

export const PresentationsPage = () => {
    const items = [
        {
            key: "my",
            label: "My Presentations",
            children: <MyPresentations />,
        },
        {
            key: "all",
            label: "All Presentations",
            children: <AllPresentations />,
        },
    ];

    return (
        <div className={styles.tabsWrapper}>
            <Tabs defaultActiveKey="my" type="line" items={items}/>
        </div>
    );
};
