import React, { useEffect, useState } from 'react';
import { Typography, Grid, CardContent } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import BlankCard from 'src/components/shared/BlankCard';
import ProductPerformance from '../views/dashboard/components/ProductPerformance';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText, Button, FormControl, InputLabel, MenuItem, Select, TextField, IconButton } from '@mui/material';
import { IconStar, IconEye, IconEdit, IconTrash, IconAlertCircleFilled } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { url } from '../../mainurl';
import axios from 'axios';
import { fontSize } from '@mui/system';


const HotelPage = () => {

    const [modal, setModal] = useState({ add: false, view: false, edit: false, delete: false });

    // Function to toggle the modal state
    const toggleModal = (type) => {
        setModal((prev) => ({ ...prev, [type]: !prev[type] }));
    };


    // filter toggle

    const [filtersVisible, setFiltersVisible] = useState(false);
    const toggleFilters = () => {
        setFiltersVisible(!filtersVisible);
        setCalendarvisible(false)
    };

    // calendar toggle

    const [calendarvisible, setCalendarvisible] = useState(false)

    const toggleCalenadar = () => {
        setCalendarvisible(!calendarvisible)
        setFiltersVisible(false)
    }

    const authTokens = JSON.parse(localStorage.getItem('authTokens'));
    let tokenStr = String(authTokens.access);


    // get category

    const [categoryList, setcategoryList] = useState([])

    const fetchCategory = () => {
        axios
            .get(`${url}/hotel/room-categories/`, {
                headers: {
                    Authorization: `Bearer ${tokenStr}`,
                    "Content-Type": "application/json",
                },
                withCredentials: false,
            })
            .then((res) => {
                setcategoryList(res.data.results);
            })
            .catch((error) => {
                let refresh = String(authTokens.refresh);
                axios.post(`${url}/api/token/refresh/`, { refresh: refresh }).then((res) => {
                    localStorage.setItem("authTokens", JSON.stringify(res.data));
                    //   setNewAuthTokens(JSON.stringify(res.data));

                    const new_headers = {
                        Authorization: `Bearer ${res.data.access}`,
                    };
                    axios
                        .get(`${url}/hotel/room-categories/`, { headers: new_headers })
                        .then((res) => {
                            setcategoryList(res.data.results);
                        });
                });
            });
    };

    useEffect(() => {
        fetchCategory();
    }, []);


    // Add Category 


    const [formData, setFormData] = useState([])

    const handleSubmit = async (event) => {
        event.preventDefault();
        let submitData = {
            category_name: formData.category_name,
            description: formData.description,
        }

        try {
            const response = await axios.post(`${url}/hotel/room-categories/`, submitData, {
                headers: {
                    Authorization: `Bearer ${tokenStr}`,
                    "Content-Type": "application/json",
                },
                withCredentials: false,
            });
            toggleModal('add')
            fetchCategory()
        } catch (error) {
            console.error('Error:', error);
        } finally {
        }
    };

    //  Edit Category

    const [editData, setEditData] = useState([])

    const handleEdit = async (event) => {
        event.preventDefault();
        let submitData = {
            category_name: editData.category_name,
            description: editData.description,
        };

        try {
            const response = await axios.put(`${url}/hotel/room-categories/${editData.id}/`, submitData, {
                headers: {
                    Authorization: `Bearer ${tokenStr}`,
                    "Content-Type": "application/json",
                },
                withCredentials: false,
            });
            toggleModal('edit');
            fetchCategory();
        } catch (error) {
            console.error('Error:', error);
        } finally {
        }
    };


    // Delete Category

    const [deleteData, setDeleteData] = useState([])

    const handleDelete = async (id) => {
        try {
            const response = await axios.delete(`${url}/hotel/room-categories/${id}/`, {
                headers: {
                    Authorization: `Bearer ${tokenStr}`,
                    "Content-Type": "application/json",
                },
                withCredentials: false,
            });
            toggleModal('delete')
            fetchCategory();
        } catch (error) {
            console.error('Error:', error);
        }
    };


    return (
        <PageContainer title="Hotels" description="Hotels">
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }} gap={2} mb={2}>
                {/* <Button size="small" variant={calendarvisible ? "contained" : "outlined"} color='primary' onClick={toggleCalenadar}>Calendar</Button> */}
                {/* <Button size="small" variant={filtersVisible ? "contained" : "outlined"} color='primary' onClick={toggleFilters}>Filters</Button> */}
                <Button size="small" variant="outlined" color='success' onClick={() => toggleModal('add')}>Add Category</Button>
            </Box>

            {/* Filter Box */}

            {filtersVisible && (
                <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', p: 2, bgcolor: 'background.paper', mb: 3 }}>
                    <Typography variant="h6" mb={2}>Filter By</Typography>
                    <Grid container spacing={3}>
                        {/* Category Filter */}
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select label="Category">
                                    <MenuItem value="Luxury">Luxury</MenuItem>
                                    <MenuItem value="Budget">Budget</MenuItem>
                                    <MenuItem value="Business">Business</MenuItem>
                                    <MenuItem value="Resort">Resort</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Rating Filter */}
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth>
                                <InputLabel>Rating</InputLabel>
                                <Select label="Rating">
                                    {[...Array(5)].map((_, index) => (
                                        <MenuItem key={index + 1} value={index + 1}>{index + 1}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Location Filter */}
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth>
                                <InputLabel>Location</InputLabel>
                                <Select label="Location">
                                    <MenuItem value="Abu Dhabi">Abu Dhabi</MenuItem>
                                    <MenuItem value="Dubai">Dubai</MenuItem>
                                    <MenuItem value="Sharjah">Sharjah</MenuItem>
                                    <MenuItem value="Fujairah">Fujairah</MenuItem>
                                    <MenuItem value="Ajman">Ajman</MenuItem>
                                    <MenuItem value="Umm Al Quwain">Umm Al Quwain</MenuItem>
                                    <MenuItem value="Ras Al Khaimah">Ras Al Khaimah</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Category Filter */}
                        <Grid item xs={12} sm={3}>
                            <FormControl fullWidth>
                                <InputLabel>Facilities</InputLabel>
                                <Select label="Category">
                                    <MenuItem value="Parking">Parking</MenuItem>
                                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                                    <MenuItem value="Gym">Gym</MenuItem>
                                    <MenuItem value="Breakfast">Breakfast</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {calendarvisible && (
                <Box sx={{ border: '1px solid #ddd', borderRadius: '8px', p: 2, bgcolor: 'background.paper', mb: 3 }}>
                    <Typography variant="h6" mb={2}>Date Filter</Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={3}>
                            <Typography variant="body1" mb={1}>From Date</Typography>
                            <input
                                type="date"
                                className="form-control"
                            />
                        </Grid>
                        <Grid item xs={12} sm={3}>
                            <Typography variant="body1" mb={1}>To Date</Typography>
                            <input
                                type="date"
                                className="form-control"
                            />
                        </Grid>
                    </Grid>
                </Box>
            )}



            <Grid container spacing={3}>
                <Grid item sm={12} lg={12}>
                    <DashboardCard title="Our Category">

                        <Box sx={{ overflow: 'auto', width: { xs: '300px', sm: 'auto' } }}>
                            <Table
                                aria-label="simple table"
                                sx={{
                                    whiteSpace: "nowrap",
                                }}
                            >
                                <TableHead>
                                    <TableRow>
                                        <TableCell align='center'>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                SN
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                Category Name
                                            </Typography>
                                        </TableCell>
                                        <TableCell align='center'>
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                Description
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center">
                                            <Typography variant="subtitle2" fontWeight={600}>
                                                Action
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {categoryList && categoryList.length > 0 ? (
                                        categoryList.map((item, index) => (
                                            <TableRow key={item.id}>
                                                <TableCell align='center'>
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {index + 1}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {item.category_name}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography variant="subtitle2" fontWeight={600}>
                                                        {item.description}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Box display="flex" alignItems="center" justifyContent="center">
                                                        <IconEye width={20} style={{ marginRight: "15px", cursor: "pointer" }} />
                                                        <IconEdit width={20} onClick={() => { toggleModal('edit'); setEditData(item); }} style={{ marginRight: "15px", cursor: "pointer" }} />
                                                        <IconTrash width={20} onClick={() => { toggleModal('delete'); setDeleteData(item); }} style={{ cursor: "pointer" }} />
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center">
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    No Data to Display
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </Box>
                    </DashboardCard>
                </Grid>
            </Grid>

            {/* add modal */}

            <Dialog
                open={modal.add}
                onClose={() => toggleModal('add')}
                maxWidth="sm"
                fullWidth
                sx={{ padding: 4 }}
            >
                <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }} id="customized-dialog-title">
                    Add Category
                    <IconButton aria-label="close" onClick={() => toggleModal('add')} sx={{ position: 'absolute', right: 8, top: 8 }}>x</IconButton>
                </DialogTitle>

                <DialogContent sx={{ padding: 3 }}>
                    <form className="row gy-4 mt-2" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item md={12} xs={12}>
                                <TextField
                                    label="Category Name"
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Enter Category Name"
                                    margin="normal"
                                    onChange={(e) => { setFormData({ ...formData, category_name: e.target.value }) }}
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    placeholder="Enter Description"
                                    onChange={(e) => { setFormData({ ...formData, description: e.target.value }) }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 4 }}
                        >
                            Submit
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>


            {/* edit modal */}

            <Dialog
                open={modal.edit}
                onClose={() => toggleModal('edit')}
                maxWidth="sm"
                fullWidth
                sx={{ padding: 4 }}
            >
                <DialogTitle sx={{ m: 0, p: 2, position: 'relative' }} id="customized-dialog-title">
                    Edit Category
                    <IconButton aria-label="close" onClick={() => toggleModal('edit')} sx={{ position: 'absolute', right: 8, top: 8 }}>x</IconButton>
                </DialogTitle>

                <DialogContent sx={{ padding: 3 }}>
                    <form className="row gy-4 mt-2" onSubmit={handleEdit}>
                        <Grid container spacing={3}>
                            <Grid item md={12} xs={12}>
                                <TextField
                                    label="Category Name"
                                    variant="outlined"
                                    fullWidth
                                    placeholder="Enter Category Name"
                                    defaultValue={editData.category_name}
                                    margin="normal"
                                    onChange={(e) => { setEditData({ ...editData, category_name: e.target.value }) }}
                                />
                            </Grid>
                            <Grid item md={12} xs={12}>
                                <TextField
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    defaultValue={editData.description}
                                    onChange={(e) => { setEditData({ ...editData, description: e.target.value }) }}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            sx={{ marginTop: 4 }}
                        >
                            Submit
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* delete confirmation */}

            <Dialog
                open={modal.delete}
                onClose={() => toggleModal('delete')}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{ style: { borderRadius: '15px', padding: '16px', maxWidth: '350px' } }}>
                <DialogTitle id="alert-dialog-title" style={{ fontSize: '1rem', fontWeight: 'bold', textAlign: 'center', paddingBottom: '8px' }}><IconAlertCircleFilled /></DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description" style={{ fontSize: '1rem', textAlign: 'center', color: '#333' }}>
                        Are you sure you want to Cancel {deleteData.category_name}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions style={{ justifyContent: 'center', padding: '16px' }}>
                    <Button onClick={() => handleDelete(deleteData.id)} style={{ backgroundColor: '#2ecc71', color: 'white', fontSize: '1rem', padding: '6px 24px', margin: '0 8px' }}>
                        Yes
                    </Button>
                    <Button onClick={() => toggleModal('delete')} style={{ backgroundColor: '#e74c3c', color: 'white', fontSize: '1rem', padding: '6px 24px', margin: '0 8px' }}>
                        No
                    </Button>
                </DialogActions>
            </Dialog>

        </PageContainer>
    );
};

export default HotelPage;