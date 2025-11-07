# Componentes-

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  Avatar,
  Stack,
  Divider,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  document_type?: {
    abbreviation: string;
    name: string;
  };
}

export const Dashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔁 Carga automática de usuarios
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/users");
        setUsers(res.data);
        setError(null);
      } catch (err) {
        console.error("❌ Error al cargar usuarios:", err);
        setError("Error al obtener usuarios desde el servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers(); // se ejecuta automáticamente al montar
  }, []);

  // 🔄 Estado de carga
  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress size={60} color="primary" />
      </Box>
    );

  // ⚠️ Estado de error
  if (error)
    return (
      <Box p={4}>
        <Alert severity="error" variant="filled">
          {error}
        </Alert>
      </Box>
    );

  // ✅ Render principal
  return (
    <Box sx={{ p: 5, backgroundColor: "#f4f6f8", minHeight: "100vh" }}>
      <Stack direction="row" alignItems="center" justifyContent="center" mb={4}>
        <PersonIcon color="primary" sx={{ fontSize: 36, mr: 1 }} />
        <Typography variant="h4" fontWeight="bold" color="primary">
          Panel de Usuarios
        </Typography>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 3 }}>
        <Table>
          <TableHead sx={{ backgroundColor: "#1976d2" }}>
            <TableRow>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>ID</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Nombre</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Correo</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>Teléfono</TableCell>
              <TableCell sx={{ color: "white", fontWeight: "bold" }}>
                Tipo de Documento
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow
                  key={user.id}
                  hover
                  sx={{
                    transition: "background-color 0.2s ease",
                    "&:hover": { backgroundColor: "#f1f8ff" },
                  }}
                >
                  <TableCell>{user.id}</TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Avatar sx={{ bgcolor: "#2196f3", width: 32, height: 32 }}>
                        {user.first_name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography>
                        {user.first_name} {user.last_name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.phone || "—"}</TableCell>
                  <TableCell>
                    {user.document_type
                      ? `${user.document_type.abbreviation} - ${user.document_type.name}`
                      : "No asignado"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary" fontStyle="italic">
                    No hay usuarios registrados
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
