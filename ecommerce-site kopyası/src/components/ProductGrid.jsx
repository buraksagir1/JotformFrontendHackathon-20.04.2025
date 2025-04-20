import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, decreaseNumber, getAllProducts, increaseNumber, removeItem, addToFavorites, removeFromFavorites } from '../slices/ProductsSlice'
import { Grid, Box, Container, Button, IconButton } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

export default function ProductGrid() {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        dispatch(getAllProducts());
        console.log(products);
    }, [dispatch])

    const products = useSelector((state) => (state.products.products))
    console.log(products);

    const handleFavoriteToggle = (product, e) => {
        e.stopPropagation();

        if (product.isFavorite) {
            dispatch(removeFromFavorites(product));
        } else {
            dispatch(addToFavorites(product));
        }
    }

    return (
        <Container >
            <Box mt={5} sx={{ flexGrow: 1 }}>
                <Grid container spacing={{ sm: 3, md: 3 }}>
                    {products.map((p) => (
                        <Grid item marginTop={10} display={"flex"} flexDirection={"column"} justifyContent={"space-between"} maxHeight={"500px"} maxWidth={"390px"} key={p.pid} xs={12} sm={6} md={3}>
                            <Box position="relative">
                                <img onClick={() => (navigate("/product/" + p.pid))} style={{ maxWidth: "290px", height: "290px", cursor: "pointer", borderRadius: "10px" }} src={JSON.parse(p.images)[0]} alt="" />

                                <IconButton
                                    onClick={(e) => handleFavoriteToggle(p, e)}
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
                                    {p.isFavorite ? (
                                        <FavoriteIcon fontSize="small" style={{ color: 'red' }} />
                                    ) : (
                                        <FavoriteBorderIcon fontSize="small" style={{ color: 'gray' }} />
                                    )}
                                </IconButton>
                            </Box>

                            <h4 style={{ maxWidth: "300px", cursor: "pointer" }}>{p.name}</h4>

                            <p>{p.description}</p>

                            <h4 style={{ marginTop: "0px", cursor: "pointer" }}>{p.price} $</h4>

                            {p.inCart ?
                                (
                                    <Box sx={{ width: "100%" }} display={"flex"} justifyContent={'center'} gap={4} alignItems={"center"}>
                                        {p.hasQuantity === 1 ? (<DeleteIcon onClick={() => (dispatch(removeItem(p)))} sx={{ color: "red" }} cursor={"pointer"} />) : (<RemoveIcon
                                            onClick={() => (dispatch(decreaseNumber(p)))}
                                            cursor={"pointer"} />)}
                                        <p>{p.hasQuantity}</p>
                                        <AddIcon onClick={() => (dispatch(increaseNumber(p)))} cursor={"pointer"} />
                                    </Box>
                                ) :
                                (
                                    <Button
                                        onClick={() => (dispatch(addToCart(p)
                                        ))}
                                        cursor={"pointer"} style={{ maxWidth: "300px", }}>Sepete Ekle</Button>
                                )}
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Container>
    )
}