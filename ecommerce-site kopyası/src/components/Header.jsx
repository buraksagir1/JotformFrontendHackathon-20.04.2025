import React, { useEffect, useState } from 'react';
import { Box, Drawer, Avatar, TextField, Menu, Button, Typography } from '@mui/material';
import CurrencyLiraIcon from '@mui/icons-material/CurrencyLira';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { increaseNumber, decreaseNumber, removeItem, search, displayAllProducts, categorize, setCategory } from '../slices/ProductsSlice';
import MenuIcon from '@mui/icons-material/Menu';

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const cart = useSelector((state) => state.products.cart);
    const categories = useSelector((state) => state.products.categories);
    const favorites = useSelector((state) => state.products.favorites);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchedProduct, setSearchedProduct] = useState("");

    const toggleDrawer = (open) => () => {
        setIsOpen(open);
    };

    let cartTotal = cart.reduce((total, item) => total + (item.price * item.hasQuantity), 0);
    const cartQuantity = cart.reduce((total, cartItem) => total + cartItem.hasQuantity, 0);


    useEffect(() => {
        dispatch(search(searchedProduct))
    }, [searchedProduct, dispatch])

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleCategorySelect = (category) => {
        dispatch(setCategory(category));
        navigate('/products');
        handleClose();
    };

    const handleAllProducts = () => {
        dispatch(setCategory('all'));
        navigate('/products');
        handleClose();
    };

    return (
        <Box>
            <Box
                sx={{ backgroundColor: 'black' }}
                position="fixed"
                top={0}
                right={0}
                left={0}
                justifyContent="space-between"
                display="flex"
                alignItems="center"
                zIndex={1000}
                px={{ xs: 2, sm: 4, md: 27 }}
            >
                {/**Menu Starts */}
                <Box >
                    <Button
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        <MenuIcon sx={{ fontSize: "25px", color: "white" }} />
                    </Button>
                    <Menu
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                        PaperProps={{
                            sx: {
                                width: '180px',
                                paddingRight: '10px',
                                paddingLeft: '10px',
                                backgroundColor: "black",
                                color: "white"
                            },
                        }}
                    >
                        <Box>
                            <h4
                                onMouseOver={(e) => (e.target.style.backgroundColor = "dimgrey")}
                                onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                                style={{ cursor: "pointer" }}
                                onClick={handleAllProducts}
                            >
                                Tüm Ürünler
                            </h4>

                            {categories && categories.map((category) => (
                                <h4
                                    key={category}
                                    onMouseOver={(e) => (e.target.style.backgroundColor = "dimgrey")}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category}
                                </h4>
                            ))}
                        </Box>
                    </Menu>
                </Box>
                {/**Menu Ends */}

                <Box
                    onClick={() => {
                        navigate("/");
                        dispatch(displayAllProducts());
                    }}
                    display="flex"
                    alignItems="center"
                    maxWidth={"137px"}
                    sx={{ cursor: 'pointer', width: { xs: "auto", sm: "auto", md: "100%" } }}
                >
                    <Typography variant="h3" fontWeight={"bold"} fontFamily={"inter"} fontSize={"20px"} sx={{ display: { xs: "none", sm: "none", md: "block" } }}>
                        JOTFORM STORE
                    </Typography>
                </Box>



                <Box sx={{ maxWidth: 500, margin: "0 auto", padding: 2, width: { xs: "100%", sm: "100%", md: "100%" } }}>
                    <TextField
                        sx={{
                            border: 'none', backgroundColor: "gray",
                            borderRadius: "20px"
                        }}
                        value={searchedProduct}
                        onChange={(e) => setSearchedProduct(e.target.value)}
                        fullWidth
                        variant="outlined"
                        placeholder="Ara..."
                        InputProps={{
                            style: { borderRadius: 20 },
                        }}
                    />
                </Box>

                <Box position="relative" display={"flex"} spacing={"20px"} >

                    <Box
                        onClick={() => navigate("/favorites")}
                        display="flex"
                        position="relative"
                        alignItems="center"
                        sx={{ cursor: 'pointer', marginRight: 2 }}
                    >
                        <FavoriteIcon sx={{ color: "white", fontSize: "25px" }} />
                        {favorites.length > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                backgroundColor: 'red',
                                borderRadius: '50%',
                                width: '18px',
                                height: '18px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: 'white'
                            }}>
                                {favorites.length}
                            </span>
                        )}
                    </Box>
                    <ShoppingCartIcon m onClick={toggleDrawer(true)} sx={{ cursor: 'pointer', marginRight: "20px" }} />
                    {cartQuantity > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            backgroundColor: 'red',
                            borderRadius: '50%',
                            width: '18px',
                            height: '18px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            color: 'white'
                        }}>
                            {cart.length}
                        </span>
                    )}
                </Box>
            </Box>

            {/**Cart Modal Starts */}
            <Drawer
                anchor="right"
                open={isOpen}
                onClose={toggleDrawer(false)}
                disableEnforceFocus
                disableRestoreFocus
            >

                {cart.length === 0 ?
                    (null) : (
                        <h4 style={{ backgroundColor: "black", color: "white", margin: 0, paddingTop: "10px" }}>Sepetim </h4>
                    )}

                {cart.length === 0 ? (
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={2}
                        sx={{ width: 300, p: 2, backgroundColor: 'black', color: 'white' }}
                    >
                        <ProductionQuantityLimitsIcon />
                        <h4 style={{ backgroundColor: "black", color: "white" }}>Sepetiniz Boş</h4>
                    </Box>
                ) : (
                    <Box
                        display="flex"
                        flexDirection="column"
                        sx={{ width: 500, p: 2, backgroundColor: 'black', color: 'white' }}
                    >
                        {cart.map((cartItem) => (
                            <Box
                                key={`${cartItem.pid}`}
                                display="flex"
                                justifyContent="space-between"
                                flexDirection="column"
                            >
                                <Box display="flex" gap={4} alignItems="center">
                                    <Box
                                        sx={{ width: '50%' }}
                                        display="flex"
                                        gap={1}
                                        alignItems="center"
                                    >
                                        <Avatar src={JSON.parse(cartItem.images)[0]} />
                                        <p>{cartItem.name}</p>
                                    </Box>

                                    <Box sx={{ width: '15%' }} display="flex">
                                        <p>{cartItem.price} TL</p>
                                    </Box>

                                    <Box
                                        sx={{ width: '30%' }}
                                        display="flex"
                                        gap={1}
                                        alignItems="center"
                                    >
                                        {cartItem.hasQuantity === 1 ? (
                                            <DeleteIcon
                                                onClick={() => dispatch(removeItem(cartItem))}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        ) : (
                                            <RemoveIcon
                                                onClick={() => dispatch(decreaseNumber(cartItem))}
                                                sx={{ cursor: 'pointer' }}
                                            />
                                        )}
                                        <p>{cartItem.hasQuantity}</p>
                                        <AddIcon
                                            onClick={() => dispatch(increaseNumber(cartItem))}
                                            sx={{ cursor: 'pointer' }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                        <Box>
                            {
                                <h4>Sepet Tutarı: {cartTotal.toFixed(2)} TL </h4>
                            }
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                onClick={() => {
                                    navigate('/checkout');
                                    toggleDrawer(false)();
                                }}
                                sx={{ mt: 2 }}
                                disabled={cart.length === 0}
                            >
                                Ödeme Yap
                            </Button>
                        </Box>
                    </Box>
                )}
            </Drawer>
            {/**Modal Ends */}
        </Box>
    );
}