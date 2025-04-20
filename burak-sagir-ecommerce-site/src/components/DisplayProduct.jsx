import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Container, Button, Grid, IconButton, Typography } from '@mui/material'
import { addToCart, increaseNumber, decreaseNumber, removeItem, addToFavorites, removeFromFavorites } from '../slices/ProductsSlice';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function DisplayProduct() {
    const { productId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const products = useSelector((state) => (state.products.products));
    const displayedProduct = products.find((p) => (Number(p.pid) === Number(productId)));

    if (!displayedProduct) {
        return <Box><h3>Ürün bulunamadı veya yükleniyor...</h3></Box>;
    }

    const handleFavoriteToggle = () => {
        if (displayedProduct.isFavorite) {
            dispatch(removeFromFavorites(displayedProduct));
        } else {
            dispatch(addToFavorites(displayedProduct));
        }
    };

    const connectedProductIds = JSON.parse(displayedProduct.connectedProducts || "[]");
    const relatedProducts = products.filter(product => connectedProductIds.includes(product.pid));

    const handleRelatedProductClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <Container display={"flex"}>
            <Grid container >
                <Grid item xs={12} sm={9} md={9}  >
                    <Box display={"flex"} mt={10} flexDirection={"column"} width={"100%"}>
                        <Box display="flex" alignItems="center" gap={2} style={{ width: "80%" }}>
                            <h2 style={{ flex: 1 }}>{displayedProduct.name}</h2>
                            <IconButton
                                onClick={handleFavoriteToggle}
                                style={{
                                    background: 'rgba(240,240,240,0.7)',
                                    width: '35px',
                                    height: '35px'
                                }}
                            >
                                {displayedProduct.isFavorite ? (
                                    <FavoriteIcon fontSize="medium" style={{ color: 'red' }} />
                                ) : (
                                    <FavoriteBorderIcon fontSize="medium" style={{ color: 'gray' }} />
                                )}
                            </IconButton>
                        </Box>

                        <img
                            style={{ marginTop: "30px", width: "60%", height: "auto", maxHeight: "550px", borderRadius: "15px" }}
                            src={JSON.parse(displayedProduct.images)[0]}
                            alt=""
                        />
                        <p style={{ width: "80%", height: "auto", marginTop: "20px" }}>{displayedProduct.description}</p>
                        <h3 style={{ width: "80%" }}>{displayedProduct.price} $</h3>

                        <Box display={"flex"} alignItems={"center"} gap={2} style={{ width: "80%" }}>
                            {displayedProduct.inCart ? (
                                <>
                                    {displayedProduct.hasQuantity === 1 ? (
                                        <DeleteIcon
                                            onClick={() => dispatch(removeItem(displayedProduct))}
                                            sx={{ color: "red" }}
                                            cursor={"pointer"}
                                        />
                                    ) : (
                                        <RemoveIcon
                                            onClick={() => dispatch(decreaseNumber(displayedProduct))}
                                            cursor={"pointer"}
                                        />
                                    )}
                                    <p>{displayedProduct.hasQuantity}</p>
                                    <AddIcon
                                        onClick={() => dispatch(increaseNumber(displayedProduct))}
                                        cursor={"pointer"}
                                    />
                                </>
                            ) : (
                                <Button
                                    variant="contained"
                                    width={"100%"}
                                    onClick={() => dispatch(addToCart(displayedProduct))}
                                >
                                    Sepete Ekle
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={12} sm={3} md={3} >
                    <Box
                        mt={"80px"}
                        display={"flex"}
                        flexDirection={"column"}
                        alignItems={"center"}
                        justifyContent={"center"}
                        width={"100%"}
                    >
                        <h2>Bunları da beğenebilirsin!</h2>
                        <Box width={"100%"} padding={"0 16px"}>

                            {relatedProducts.length > 0 ? (
                                relatedProducts.map((product) => (
                                    <Box
                                        key={product.pid}
                                        onClick={() => handleRelatedProductClick(product.pid)}
                                        sx={{
                                            width: '100%',
                                            padding: '10px',
                                            marginBottom: '10px',
                                            border: '1px solid #eee',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                            },
                                            display: 'flex',
                                            alignItems: 'center'
                                        }}
                                    >
                                        <img
                                            src={JSON.parse(product.images)[0]}
                                            alt={product.name}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                                borderRadius: '4px',
                                                marginRight: '10px'
                                            }}
                                        />
                                        <Box sx={{ flex: 1 }}>
                                            <Box sx={{ fontWeight: 'bold', fontSize: '14px' }}>{product.name}</Box>
                                            <Box sx={{ color: '#1976d2', fontSize: '14px' }}>{product.price} $</Box>
                                        </Box>
                                    </Box>
                                ))
                            ) : (
                                <h2>Benzer ürün bulunamadı.</h2>
                            )}
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    )
}