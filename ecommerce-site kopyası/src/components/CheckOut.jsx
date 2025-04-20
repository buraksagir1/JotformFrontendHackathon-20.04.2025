import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Container,
    Typography,
    Grid,
    Paper,
    TextField,
    Button,
    Divider,
    CircularProgress,
    Snackbar,
    Alert
} from '@mui/material';
import { clearCart } from '../slices/ProductsSlice';

const CheckoutPage = () => {
    const { cart } = useSelector(state => state.products);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        city: '',
        zipCode: '',
        phoneNumber: ''
    });
    const [alert, setAlert] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'İsim gerekli';
        if (!formData.email.trim()) newErrors.email = 'E-posta gerekli';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Geçerli bir e-posta adresi girin';
        if (!formData.address.trim()) newErrors.address = 'Adres gerekli';
        if (!formData.city.trim()) newErrors.city = 'Şehir gerekli';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'Posta kodu gerekli';
        if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Telefon numarası gerekli';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    if (cart.length === 0) {
        return (
            <Container maxWidth="md">
                <Box mt={10} mb={5} textAlign="center">
                    <Typography variant="h4" gutterBottom>
                        Sepetiniz Boş
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/')}
                        sx={{ mt: 2 }}
                    >
                        Alışverişe Devam Et
                    </Button>
                </Box>
            </Container>
        );
    }

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.hasQuantity), 0);

    const prepareSubmissionData = () => {
        let orderSummary = "Sipariş Özeti:\n\n";

        cart.forEach((item, index) => {
            orderSummary += `${index + 1}. ${item.name} - ${item.hasQuantity} adet x ${item.price} TL = ${(item.price * item.hasQuantity).toFixed(2)} TL\n`;
        });

        orderSummary += `\nToplam: ${cartTotal.toFixed(2)} TL`;

        const submission = {
            "1": formData.name,
            "2": formData.email,
            "3": formData.address,
            "4": formData.city,
            "5": formData.zipCode,
            "6": formData.phoneNumber,
            "7": orderSummary,
            "8": cartTotal.toFixed(2)
        };

        return submission;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const formData = new FormData();
            const submissionData = prepareSubmissionData();

            for (const key in submissionData) {
                formData.append(`submission[${key}]`, submissionData[key]);
            }

            const formId = "251073649788976";
            const apiKey = "0f949a15282324a8dc41067fd84eb8c8";

            const response = await axios.post(
                `https://api.jotform.com/form/${formId}/submissions?apiKey=${apiKey}`,
                formData
            );

            console.log("Jotform response:", response.data);

            if (response.data.responseCode === 200) {
                setAlert({
                    open: true,
                    message: 'Siparişiniz başarıyla alındı!',
                    severity: 'success'
                });

                dispatch(clearCart());

                setTimeout(() => {
                    navigate('/order-success');
                }, 2000);
            } else {
                setAlert({
                    open: true,
                    message: 'Sipariş oluşturulurken bir hata oluştu.',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error("Submission error:", error);
            setAlert({
                open: true,
                message: 'Bir hata oluştu. Lütfen tekrar deneyin.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="lg">
            <Box mt={10} mb={5}>
                <Typography variant="h4" gutterBottom>
                    Ödeme Sayfası
                </Typography>

                <Grid container spacing={4}>
                    {/* Sipariş Özeti */}
                    <Grid item xs={12} md={5}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Sipariş Özeti
                            </Typography>

                            <Box mb={2}>
                                {cart.map((item) => (
                                    <Box key={item.pid} display="flex" justifyContent="space-between" mb={1}>
                                        <Typography>
                                            {item.name} x {item.hasQuantity}
                                        </Typography>
                                        <Typography>
                                            {(item.price * item.hasQuantity).toFixed(2)} TL
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box display="flex" justifyContent="space-between">
                                <Typography variant="h6">Toplam</Typography>
                                <Typography variant="h6">{cartTotal.toFixed(2)} TL</Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={7}>
                        <Paper elevation={3} sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                Teslimat Bilgileri
                            </Typography>

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Ad Soyad"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            error={!!errors.name}
                                            helperText={errors.name}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="E-posta"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            error={!!errors.email}
                                            helperText={errors.email}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Adres"
                                            name="address"
                                            multiline
                                            rows={3}
                                            value={formData.address}
                                            onChange={handleChange}
                                            error={!!errors.address}
                                            helperText={errors.address}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Şehir"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            error={!!errors.city}
                                            helperText={errors.city}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Posta Kodu"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            error={!!errors.zipCode}
                                            helperText={errors.zipCode}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Telefon"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            error={!!errors.phoneNumber}
                                            helperText={errors.phoneNumber}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Button
                                            type="submit"
                                            variant="contained"
                                            color="primary"
                                            fullWidth
                                            size="large"
                                            disabled={loading}
                                            sx={{ mt: 2 }}
                                        >
                                            {loading ? <CircularProgress size={24} /> : 'Siparişi Tamamla'}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={() => setAlert(prev => ({ ...prev, open: false }))}
            >
                <Alert
                    onClose={() => setAlert(prev => ({ ...prev, open: false }))}
                    severity={alert.severity}
                    sx={{ width: '100%' }}
                >
                    {alert.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CheckoutPage;