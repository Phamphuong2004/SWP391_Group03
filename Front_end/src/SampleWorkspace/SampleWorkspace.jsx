import React from "react";
import { Tabs } from "antd";
import SampleManagement from "../SampleManagement/SampleManagement";
import SampleTypeManagement from "../SampleTypeManagement/SampleTypeManagement";
import "../SampleTypeManagement/SampleTypeManagement.css";
import "../SampleManagement/SampleManagement.css";

const { TabPane } = Tabs;

const SampleWorkspace = () => (
  <div style={{ maxWidth: 1000, margin: "0 auto", padding: 24 }}>
    <Tabs defaultActiveKey="1">
      <TabPane tab="Quản lý mẫu xét nghiệm" key="1">
        <SampleManagement />
      </TabPane>
      <TabPane tab="Quản lý loại mẫu" key="2">
        <SampleTypeManagement />
      </TabPane>
    </Tabs>
  </div>
);

export default SampleWorkspace;
