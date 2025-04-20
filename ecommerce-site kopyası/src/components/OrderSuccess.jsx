import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button, Paper } from '@mui/material';
import { useDispatch } from 'react-redux';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderSuccessPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();


    return (
        <Container maxWidth="md">
            <Box
                mt={10}
                mb={5}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                height="60vh"
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        width: '100%'
                    }}
                >
                    <CheckCircleOutlineIcon
                        sx={{
                            fontSize: 80,
                            color: 'success.main',
                            mb: 2
                        }}
                    />

                    <Typography variant="h4" align="center" gutterBottom>
                        Siparişiniz Alındı!
                    </Typography>

                    <Typography variant="body1" align="center" paragraph>
                        Siparişiniz başarıyla oluşturuldu. Sipariş bilgileriniz e-posta adresinize gönderilecektir.
                    </Typography>

                    <Typography variant="body2" align="center" paragraph>
                        Sipariş numaranız ve detayları için e-posta kutunuzu kontrol ediniz.
                    </Typography>

                    <Box mt={4} display="flex" justifyContent="center" gap={2}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/')}
                        >
                            Alışverişe Devam Et
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    );
};

export default OrderSuccessPage;