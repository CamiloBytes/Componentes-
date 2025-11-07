// src/components/UserDialog.tsx
import { useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { userSchema } from "../validations/userShema";
import type { User, Iuser } from "../types/user.type";

interface IProps {
  open: boolean;
  onclose: () => void;
  onsubmit: (user: User) => void;
  editingUser?: Iuser | null;
}

export function UserFormDialog({ open, onclose, onsubmit, editingUser }: IProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<User>({
    resolver: yupResolver(userSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (editingUser) {
      reset({
        first_name: editingUser.first_name,
        last_name: editingUser.last_name,
        email: editingUser.email,
        phone: editingUser.phone,
      });
    } else {
      reset({ first_name: "", last_name: "", email: "", phone: "" });
    }
  }, [editingUser, reset]);

  const submitForm = async (data: User) => {
    await onsubmit(data);
    reset();
  };

  return (
    <Dialog
      open={open}
      onClose={onclose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#374151",
          color: "#f3f4f6",
        },
      }}
    >
      <DialogTitle sx={{ color: "#f3f4f6", fontWeight: "bold", borderBottom: "1px solid #4b5563" }}>
        {editingUser ? "Editar Usuario" : "Agregar Usuario"}
      </DialogTitle>

      <DialogContent>
        <form onSubmit={handleSubmit(submitForm)} id="user-form">
          <Stack spacing={2} mt={2}>
            <TextField
              label="Nombre"
              {...register("first_name")}
              error={!!errors.first_name}
              helperText={errors.first_name?.message}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9ca3af" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#e5e7eb" },
                "& .MuiOutlinedInput-root": {
                  color: "#f3f4f6",
                  "& fieldset": { borderColor: "#4b5563" },
                  "&:hover fieldset": { borderColor: "#6b7280" },
                  "&.Mui-focused fieldset": { borderColor: "#9ca3af" },
                },
                "& .MuiFormHelperText-root": { color: "#ef4444" },
              }}
            />
            <TextField
              label="Apellido"
              {...register("last_name")}
              error={!!errors.last_name}
              helperText={errors.last_name?.message}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9ca3af" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#e5e7eb" },
                "& .MuiOutlinedInput-root": {
                  color: "#f3f4f6",
                  "& fieldset": { borderColor: "#4b5563" },
                  "&:hover fieldset": { borderColor: "#6b7280" },
                  "&.Mui-focused fieldset": { borderColor: "#9ca3af" },
                },
                "& .MuiFormHelperText-root": { color: "#ef4444" },
              }}
            />
            <TextField
              label="Correo electrónico"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9ca3af" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#e5e7eb" },
                "& .MuiOutlinedInput-root": {
                  color: "#f3f4f6",
                  "& fieldset": { borderColor: "#4b5563" },
                  "&:hover fieldset": { borderColor: "#6b7280" },
                  "&.Mui-focused fieldset": { borderColor: "#9ca3af" },
                },
                "& .MuiFormHelperText-root": { color: "#ef4444" },
              }}
            />
            <TextField
              label="Teléfono"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              fullWidth
              sx={{
                "& .MuiInputLabel-root": { color: "#9ca3af" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#e5e7eb" },
                "& .MuiOutlinedInput-root": {
                  color: "#f3f4f6",
                  "& fieldset": { borderColor: "#4b5563" },
                  "&:hover fieldset": { borderColor: "#6b7280" },
                  "&.Mui-focused fieldset": { borderColor: "#9ca3af" },
                },
                "& .MuiFormHelperText-root": { color: "#ef4444" },
              }}
            />
          </Stack>
        </form>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2, borderTop: "1px solid #4b5563" }}>
        <Button
          onClick={onclose}
          disabled={isSubmitting}
          sx={{
            color: "#9ca3af",
            "&:hover": { backgroundColor: "#4b5563" },
            textTransform: "none",
          }}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          form="user-form"
          variant="contained"
          disabled={isSubmitting}
          sx={{
            backgroundColor: "#6b7280",
            "&:hover": { backgroundColor: "#4b5563" },
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          {editingUser ? "Guardar cambios" : "Crear"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}