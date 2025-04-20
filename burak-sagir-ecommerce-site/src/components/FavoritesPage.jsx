import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, decreaseNumber, increaseNumber, removeItem, removeFromFavorites } from '../slices/ProductsSlice';
import { Grid, Box, Container, Button, Typography, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';

const FavoritesPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { favorites } = useSelector(state => state.products);

    const handleRemoveFromFavorites = (product, e) => {
        e.stopPropagation();
        dispatch(removeFromFavorites(product));
    };

    return (
        <Container>
            <Box mt={10} mb={2}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Favori Ürünlerim
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    {favorites.length} ürün
                </Typography>
            </Box>

            {favorites.length === 0 ? (
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    flexDirection="column"
                    height="300px"
                    bgcolor="rgba(0,0,0,0.02)"
                    borderRadius="8px"
                    mt={4}
                >
                    <Typography variant="h6" mb={2}>
                        Henüz favori ürününüz yok
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => navigate('/products')}
                    >
                        Ürünlere Göz At
                    </Button>
                </Box>
            ) : (
                <Box mt={5} sx={{ flexGrow: 1 }}>
                    <Grid container spacing={{ sm: 3, md: 3 }}>
                        {favorites.map((p) => (
                            <Grid item marginTop={10} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} maxHeight={"500px"} maxWidth={"390px"} key={p.pid} xs={12} sm={6} md={3}>
                                <Box position="relative">
                                    <img
                                        onClick={() => (navigate("/product/" + p.pid))}
                                        style={{ maxWidth: "290px", height: "290px", cursor: "pointer", borderRadius: "10px" }}
                                        src={JSON.parse(p.images)[0]}
                                        alt=""
                                    />

                                    <IconButton
                                        onClick={(e) => handleRemoveFromFavorites(p, e)}
                                        style={{
                                            position: 'absolute',
                                            top: 5,
                                            right: 5,
                                            background: 'rgba(255,255,255,0.7)',
                                            padding: '5px',
                                            minWidth: 'auto',
                                            width: '30px',
                                            height: '30px'
                                        }}
                                    >
                                        <FavoriteIcon fontSize="small" style={{ color: 'red' }} />
                                    </IconButton>
                                </Box>

                                <h4 style={{ maxWidth: "300px", cursor: "pointer" }}>{p.name}</h4>

                                <p>{p.description}</p>

                                <h4 style={{ marginTop: "0px", cursor: "pointer" }}>{p.price} $</h4>

                                {p.inCart ? (
                                    <Box sx={{ width: "100%" }} display={"flex"} justifyContent={'center'} gap={4} alignItems={"center"}>
                                        {p.hasQuantity === 1 ? (
                                            <DeleteIcon
                                                onClick={() => (dispatch(removeItem(p)))}
                                                sx={{ color: "red" }}
                                                cursor={"pointer"}
                                            />
                                        ) : (
                                            <RemoveIcon
                                                onClick={() => (dispatch(decreaseNumber(p)))}
                                                cursor={"pointer"}
                                            />
                                        )}
                                        <p>{p.hasQuantity}</p>
                                        <AddIcon
                                            onClick={() => (dispatch(increaseNumber(p)))}
                                            cursor={"pointer"}
                                        />
                                    </Box>
                                ) : (
                                    <Button
                                        onClick={() => (dispatch(addToCart(p)))}
                                        cursor={"pointer"}
                                        style={{ maxWidth: "300px" }}
                                    >
                                        Sepete Ekle
                                    </Button>
                                )}
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}
        </Container>
    );
};

export default FavoritesPage;