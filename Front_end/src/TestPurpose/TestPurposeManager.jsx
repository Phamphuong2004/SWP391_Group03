import React, { useState } from "react";
import {
  getTestPurposeById,
  createTestPurpose,
  deleteTestPurpose,
} from "./TestPurposeAPI";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Checkbox,
  FormControlLabel,
  Alert,
} from "@mui/material";

export default function TestPurposeManager() {
  const [testPurposeId, setTestPurposeId] = useState("");
  const [purpose, setPurpose] = useState(null);
  const [form, setForm] = useState({
    testPurposeName: "",
    testPurposeDescription: "",
    active: true,
  });
  const [message, setMessage] = useState("");
  const [idError, setIdError] = useState("");
  const [formError, setFormError] = useState("");

  // Lấy thông tin theo id
  const handleGetById = async () => {
    setMessage("");
    setIdError("");
    if (!testPurposeId || isNaN(testPurposeId) || Number(testPurposeId) <= 0) {
      setIdError("ID phải là số dương");
      return;
    }
    setPurpose(null);
    try {
      const res = await getTestPurposeById(testPurposeId);
      setPurpose(res.data);
    } catch (err) {
      setMessage(err.response?.data?.message || "Không tìm thấy hoặc lỗi API");
    }
  };

  // Thêm mới
  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");
    setFormError("");
    if (!form.testPurposeName.trim() || !form.testPurposeDescription.trim()) {
      setFormError("Không được để trống tên hoặc mô tả");
      return;
    }
    try {
      const res = await createTestPurpose(form);
      setMessage("Tạo thành công! ID: " + res.data.id);
    } catch (err) {
      setMessage(err.response?.data?.message || "Tạo thất bại hoặc lỗi API");
    }
  };

  // Xóa theo id
  const handleDelete = async () => {
    setMessage("");
    setIdError("");
    if (!testPurposeId || isNaN(testPurposeId) || Number(testPurposeId) <= 0) {
      setIdError("ID phải là số dương");
      return;
    }
    try {
      await deleteTestPurpose(testPurposeId);
      setMessage("Đã xóa thành công!");
      setPurpose(null);
    } catch (err) {
      setMessage(err.response?.data?.message || "Xóa thất bại hoặc lỗi API");
    }
  };

  return (
    <Paper
      elevation={8}
      sx={{
        maxWidth: 500,
        mx: "auto",
        my: 6,
        p: 4,
        borderRadius: 5,
        bgcolor: "#f8faff",
        boxShadow: "0 8px 32px rgba(44,62,80,0.12)",
      }}
    >
      <Typography
        variant="h5"
        fontWeight={900}
        color="primary"
        align="center"
        mb={3}
        sx={{ letterSpacing: 1 }}
      >
        Quản lý Test Purpose
      </Typography>

      <Stack spacing={2} mb={3}>
        <Typography variant="subtitle1" fontWeight={700} color="secondary">
          Lấy/Xóa theo ID
        </Typography>
        <Stack direction="row" spacing={1}>
          <TextField
            label="Nhập testPurposeId"
            type="number"
            value={testPurposeId}
            onChange={(e) => setTestPurposeId(e.target.value)}
            size="small"
            fullWidth
            sx={{ bgcolor: "#fff", borderRadius: 2 }}
          />
          {idError && (
            <div style={{ color: "red", fontWeight: 600, marginTop: 4 }}>
              {idError}
            </div>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleGetById}
            sx={{ fontWeight: 700, px: 2 }}
          >
            XEM CHI TIẾT
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            sx={{ fontWeight: 700, px: 2 }}
          >
            XÓA
          </Button>
        </Stack>
        {purpose && (
          <Paper
            variant="outlined"
            sx={{ p: 2, bgcolor: "#f7f7f7", borderRadius: 2 }}
          >
            <div>
              <b>ID:</b> {purpose.id}
            </div>
            <div>
              <b>Tên:</b> {purpose.purposeName || purpose.testPurposeName}
            </div>
            <div>
              <b>Mô tả:</b> {purpose.testPurposeDescription}
            </div>
            <div>
              <b>Active:</b> {purpose.active ? "true" : "false"}
            </div>
          </Paper>
        )}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={2} mb={3}>
        <Typography variant="subtitle1" fontWeight={700} color="secondary">
          Thêm mới Test Purpose
        </Typography>
        <form onSubmit={handleCreate}>
          <Stack spacing={2}>
            <TextField
              label="Tên test purpose"
              value={form.testPurposeName}
              onChange={(e) =>
                setForm({ ...form, testPurposeName: e.target.value })
              }
              required
              fullWidth
              sx={{ bgcolor: "#fff", borderRadius: 2 }}
            />
            <TextField
              label="Mô tả"
              value={form.testPurposeDescription}
              onChange={(e) =>
                setForm({ ...form, testPurposeDescription: e.target.value })
              }
              required
              fullWidth
              sx={{ bgcolor: "#fff", borderRadius: 2 }}
            />
            {formError && (
              <div style={{ color: "red", fontWeight: 600, marginTop: 4 }}>
                {formError}
              </div>
            )}
            <FormControlLabel
              control={
                <Checkbox
                  checked={form.active}
                  onChange={(e) =>
                    setForm({ ...form, active: e.target.checked })
                  }
                  color="primary"
                />
              }
              label="Active"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ fontWeight: 700, borderRadius: 2, py: 1 }}
              fullWidth
            >
              TẠO MỚI
            </Button>
          </Stack>
        </form>
      </Stack>

      {message && (
        <Alert severity="info" sx={{ mt: 3 }}>
          {message}
        </Alert>
      )}
    </Paper>
  );
}
