import React, { useState } from 'react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../components/shared/DashboardCard';
import BlankCard from 'src/components/shared/BlankCard';
import ProductPerformance from '../views/dashboard/components/ProductPerformance';
import { Box, Table, TableBody, TableCell, TableHead, TableRow, Dialog, DialogActions, DialogContent, DialogTitle, Button, FormControl, InputLabel, MenuItem, Select, TextField, IconButton, Badge, Paper } from '@mui/material';
import { IconStar, IconEye, IconEdit, IconTrash } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import {
    Grid,
    Typography,
    Checkbox,
    FormControlLabel, Rating
} from "@mui/material";
import { useDropzone } from "react-dropzone";
import { Card, CardMedia } from "@mui/material";
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';

const hotels = [
    {
        "id": 1,
        "name": "The Oberoi Udaivilas",
        "location": "Udaipur, Rajasthan",
        "address": "Haridasji Ki Magri",
        "rating": 4.9,
        "contact": "+91 294 2433300",
        "image": "https://lh3.googleusercontent.com/p/AF1QipMuXeRSEy6AIfsfaADUJ0WavsP_oJVDRIvrFraH=s680-w680-h510"
    },
    {
        "id": 2,
        "name": "Taj Mahal Palace",
        "location": "Mumbai, Maharashtra",
        "address": "Apollo Bandar, Colaba",
        "rating": 4.8,
        "contact": "+91 22 6665 3366",
        "image": "https://lh3.googleusercontent.com/p/AF1QipPjR_st_vsnuJdZwzWkJ3P1ur1QdjRyNcq4VS--=s680-w680-h510"
    },
    {
        "id": 3,
        "name": "ITC Grand Chola",
        "location": "Chennai, Tamil Nadu",
        "address": "No 63, Mount Road, Guindy",
        "rating": 4.7,
        "contact": "+91 44 2220 0000",
        "image": "https://lh3.googleusercontent.com/proxy/69Ilu49qMjZ042ky0BWyqGfwRT5z-GZ6gdYALkAKUM_-EJzPwMfnVS5npRXGpn_U7Lkz4zrpfIiOCVaJMIeUAxoRmOg8ajNhTcTQejBW_O2-GkowJ8e_NIrprA3GdorM07UqvCtcR7Kl40jM-VsGMPaRaxJdMg=s680-w680-h510"
    },
    {
        "id": 4,
        "name": "Leela Palace",
        "location": "New Delhi, Delhi",
        "address": "Diplomatic Enclave, Chanakyapuri",
        "rating": 4.9,
        "contact": "+91 11 3933 1234",
        "image": "https://lh3.googleusercontent.com/p/AF1QipMyFampnjTQttMvO8BTEgylpimVrAbXg5sAtBuO=s680-w680-h510"
    },
    {
        "id": 5,
        "name": "Radisson Blu",
        "location": "Kochi, Kerala",
        "address": "Sahodaran Ayyappan Road, Elamkulam",
        "rating": 4.5,
        "contact": "+91 484 4129999",
        "image": "https://lh3.googleusercontent.com/p/AF1QipNsP26P4ImwPNap7CoHs_jUO-44JasvVB9w8Dir=w287-h192-n-k-rw-no-v1"
    }
]


const AddHotel = () => {

    const [modal, setModal] = useState({ add: false, view: false, edit: false });

    // Function to toggle the modal state
    const toggleModal = (type) => {
        setModal((prev) => ({ ...prev, [type]: !prev[type] }));
    };

    const navigate = useNavigate();

    const handleNavigateToViewHotel = (id) => {
        navigate(`/hotels/${id}`);
    }

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        photos: [],
        profilePic: null,
        rating: "",
        category: [],
        facilities: [],
        location: "",
        hotelRating: "",
        bookingPrice: "",
        discount: "",
        availableRooms: "",
        roomDetails: {
            roomCategory: "",
            roomSqFeet: "",
            beds: "",
            roomFacilities: [],
            noOfRoomsAvailable: "",
        },
        owner: {
            name: "",
            contactNo: "",
            image: null,
            email: "",
        },
        support: {
            contactNumber: "",
            email: "",
        },
    });

    const facilitiesList = ["Free WiFi", "Pool", "Gym", "Parking"];
    const categoriesList = ["Luxury", "Budget", "Family", "Business"];
    const starRatings = [1, 2, 3, 4, 5];

    const handleChange = (field, value, nestedField) => {
        if (nestedField) {
            setFormData((prev) => ({
                ...prev,
                [nestedField]: { ...prev[nestedField], [field]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }));
        }
    };

    const [imageSrc, setImageSrc] = useState('https://www.shutterstock.com/image-vector/image-icon-600nw-211642900.jpg')

    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImageSrc(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // multiple file uploads

    const [files, setFiles] = useState([]);

    const onDrop = (acceptedFiles) => {
        const updatedFiles = acceptedFiles.map((file) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file), // Create a preview URL for each file
            })
        );
        setFiles((prevFiles) => [...prevFiles, ...updatedFiles]);
    };

    const handleRemoveFile = (fileToRemove) => {
        setFiles(files.filter((file) => file !== fileToRemove));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: "image/*,application/pdf", // Accept images and PDFs
        multiple: true, // Allow multiple files
    });


    const [categories, setCategories] = useState([]);
    const [facilities, setfacilities] = useState([]);
    const [tags, settags] = useState([])
    const [roomList, setRoomList] = useState([{}])

    // stepper

    const steps = ['Hotel Details', 'Room Details', 'Owner and Support Details'];

    const [activeStep, setActiveStep] = React.useState(0);
    const [completed, setCompleted] = React.useState({});

    const totalSteps = () => {
        return steps.length;
    };

    const completedSteps = () => {
        return Object.keys(completed).length;
    };

    const isLastStep = () => {
        return activeStep === totalSteps() - 1;
    };

    const allStepsCompleted = () => {
        return completedSteps() === totalSteps();
    };

    const handleNext = () => {
        const newActiveStep =
            isLastStep() && !allStepsCompleted()
                ?
                steps.findIndex((step, i) => !(i in completed))
                : activeStep + 1;
        setActiveStep(newActiveStep);
    };

    const handleBack = () => { setActiveStep((prevActiveStep) => prevActiveStep - 1) };

    const handleStep = (step) => () => { setActiveStep(step) };

    const handleComplete = () => {
        setCompleted({
            ...completed,
            [activeStep]: true,
        });
        handleNext();
    };

    const handleReset = () => {
        setActiveStep(0);
        setCompleted({});
    };



    return (
        <PageContainer title="Hotels" description="Hotels">
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <DashboardCard title="Add Hotel">
                        <Grid container spacing={2} sx={{ p: 3 }}>
                            <Box sx={{ width: '100%' }}>
                                <Stepper nonLinear activeStep={activeStep}>
                                    {steps.map((label, index) => (
                                        <Step key={label} completed={completed[index]}>
                                            <StepButton color="inherit" onClick={handleStep(index)}>
                                                {label}
                                            </StepButton>
                                        </Step>
                                    ))}
                                </Stepper>
                                <div>
                                    {allStepsCompleted() ? (
                                        <React.Fragment>
                                            <Typography sx={{ mt: 2, mb: 1 }}>
                                                All steps completed - you&apos;re finished
                                            </Typography>
                                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                                <Box sx={{ flex: '1 1 auto' }} />
                                                <Button onClick={handleReset}>Reset</Button>
                                            </Box>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment>

                                            {activeStep === 0 && (<React.Fragment>

                                                {/* Hotel Image Upload Section */}

                                                <Grid container spacing={2} sx={{ p: 3 }}>
                                                    <Grid item xs={12} sm={3} className="relative aspect-video" sx={{ textAlign: 'center' }}>
                                                        <label htmlFor="file-upload" style={{ cursor: 'pointer', display: 'inline-block' }}>
                                                            <img
                                                                src={imageSrc}
                                                                width="100%"
                                                                height="100%"
                                                                alt="file"
                                                                className="object-cover w-full h-full rounded-lg"
                                                            />
                                                        </label>
                                                        <input id="file-upload" type="file" onChange={handleFileChange} hidden />
                                                    </Grid>


                                                    {/* Hotel Name and Description Section */}

                                                    <Grid item xs={12} sm={9}>
                                                        <TextField
                                                            label="Hotel Name"
                                                            required
                                                            variant="outlined"
                                                            fullWidth
                                                            sx={{ mb: 2 }}
                                                            onChange={(e) => handleChange('name', e.target.value)}
                                                        />
                                                        <TextField
                                                            label="Description"
                                                            variant="outlined"
                                                            fullWidth
                                                            multiline
                                                            rows={3}
                                                            onChange={(e) => handleChange('description', e.target.value)}
                                                        />
                                                        <Typography variant="body2" color="textSecondary" fontWeight="bold" className='mt-3'>
                                                            Rating :
                                                        </Typography>
                                                        <Rating
                                                            className='m-2'
                                                            name="simple-uncontrolled"
                                                            onChange={(event, newValue) => {
                                                                console.log(newValue);
                                                            }}
                                                            defaultValue={1}
                                                        />
                                                    </Grid>
                                                </Grid>


                                                {/* Hotel Image Upload Section */}

                                                <Grid container spacing={1} sx={{ mt: 2 }}>
                                                    <Grid item xs={12} sm={12}>
                                                        <Typography variant="h6" gutterBottom>
                                                            Upload Multiple Images
                                                        </Typography>
                                                        <Box
                                                            {...getRootProps()}
                                                            sx={{
                                                                border: "2px dashed #ccc",
                                                                borderRadius: "4px",
                                                                padding: "20px",
                                                                textAlign: "center",
                                                                cursor: "pointer",
                                                                backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
                                                                marginTop: "10px"
                                                            }}
                                                        >
                                                            <input {...getInputProps()} />
                                                            <Typography variant="body1" color="textSecondary">
                                                                {isDragActive ? "Drop files here..." : "Drag and drop files here or click to upload"}
                                                            </Typography>
                                                            <Button variant="contained" sx={{ mt: 2 }}>
                                                                Select Files
                                                            </Button>
                                                        </Box>
                                                        <Grid container spacing={2} style={{ marginTop: "15px", textAlign: "center" }}>
                                                            {files.map((file, index) => (
                                                                <Grid item key={index} xs={12} sm={2} md={2}>
                                                                    <Card>
                                                                        <CardMedia
                                                                            component="img"
                                                                            width="100%"
                                                                            height="100"
                                                                            image={file.preview}
                                                                            alt={file.name}
                                                                        />
                                                                        <Typography variant="body2" align="center" gutterBottom>
                                                                            {file.name}
                                                                        </Typography>
                                                                        <Button
                                                                            size="small"
                                                                            style={{ color: "red" }}
                                                                            onClick={() => handleRemoveFile(file)}
                                                                        >
                                                                            Remove
                                                                        </Button>
                                                                    </Card>
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>


                                                {/* Hotel Details Form */}

                                                <Box sx={{ mt: 4 }}>
                                                    <form>
                                                        <Typography variant="h5" className='mb-3' gutterBottom>
                                                            Hotel Details
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            {[
                                                                { label: 'Location', key: 'location' },
                                                                { label: 'Booking Price', key: 'bookingPrice' },
                                                                { label: 'Discount', key: 'discount' },
                                                                { label: 'Available Rooms', key: 'availableRooms' },
                                                            ].map((field, index) => (
                                                                <Grid item xs={12} sm={6} key={index}>
                                                                    <TextField
                                                                        label={field.label}
                                                                        variant="outlined"
                                                                        fullWidth
                                                                        onChange={(e) =>
                                                                            handleChange(field.key, e.target.value, field.group || undefined)
                                                                        }
                                                                    />
                                                                </Grid>
                                                            ))}
                                                        </Grid>
                                                    </form>
                                                </Box>

                                                {/* Category Details Form */}

                                                <Box sx={{ mt: 4 }}>
                                                    <form>
                                                        <Typography variant="h5" className='mb-3' gutterBottom>
                                                            Category and Facilities
                                                        </Typography>
                                                        <Grid container spacing={2}>
                                                            {/* Dropdowns */}
                                                            <Grid item xs={12} sm={6}>
                                                                <FormControl fullWidth>
                                                                    <InputLabel>Category</InputLabel>
                                                                    <Select
                                                                        multiple
                                                                        value={categories}
                                                                        onChange={(e) => { setCategories(e.target.value) }}
                                                                        renderValue={(selected) => selected.join(', ')}
                                                                        label="Category">
                                                                        <MenuItem value="Luxury">Luxury</MenuItem>
                                                                        <MenuItem value="Budget">Budget</MenuItem>
                                                                        <MenuItem value="Business">Business</MenuItem>
                                                                        <MenuItem value="Resort">Resort</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>

                                                            <Grid item xs={12} sm={6}>
                                                                <FormControl fullWidth>
                                                                    <InputLabel>Facilities</InputLabel>
                                                                    <Select
                                                                        multiple
                                                                        value={facilities}
                                                                        onChange={(e) => { setfacilities(e.target.value) }}
                                                                        renderValue={(selected) => selected.join(', ')}
                                                                        label="Facilities">
                                                                        <MenuItem value="Breakfast">Breakfast</MenuItem>
                                                                        <MenuItem value="Parking">Parking</MenuItem>
                                                                        <MenuItem value="Pool">Pool</MenuItem>
                                                                        <MenuItem value="Spa">Spa</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>

                                                            <Grid item xs={12} sm={6}>
                                                                <FormControl fullWidth>
                                                                    <InputLabel>Tags</InputLabel>
                                                                    <Select
                                                                        multiple
                                                                        value={tags}
                                                                        onChange={(e) => { settags(e.target.value) }}
                                                                        renderValue={(selected) => selected.join(', ')}
                                                                        label="Tags">
                                                                        <MenuItem value="">Breakfast</MenuItem>
                                                                        <MenuItem value="Parking">Parking</MenuItem>
                                                                        <MenuItem value="Pool">Pool</MenuItem>
                                                                        <MenuItem value="Spa">Spa</MenuItem>
                                                                    </Select>
                                                                </FormControl>
                                                            </Grid>

                                                        </Grid>
                                                    </form>
                                                </Box>
                                            </React.Fragment>)}

                                            {activeStep === 1 && (
                                                <React.Fragment>
                                                    <Grid container spacing={2} sx={{ p: 3 }}>
                                                        {/* Add Room Form */}

                                                        <Box sx={{ mt: 4 }}>
                                                            <Grid container alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                                                <Typography variant="h5" gutterBottom>
                                                                    Room Details
                                                                </Typography>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => setRoomList([...roomList, {}])}
                                                                >
                                                                    Add Rooms
                                                                </Button>
                                                            </Grid>

                                                            <Paper elevation={2} sx={{ p: 2 }}>
                                                                <Grid container spacing={2}>
                                                                    {roomList.map((_, index) => (
                                                                        <Grid key={index} item xs={12} sm={6} md={4}>
                                                                            {/* Room Details Card */}
                                                                            <Box sx={{ p: 2, border: '1px solid #ddd', borderRadius: '8px' }}>
                                                                                <Typography variant="subtitle1" className='mb-3' gutterBottom>
                                                                                    Room {index + 1}
                                                                                </Typography>

                                                                                <Grid container spacing={2}>
                                                                                    <Grid item xs={12} sm={12}>
                                                                                        <FormControl fullWidth>
                                                                                            <InputLabel>Category</InputLabel>
                                                                                            <Select
                                                                                                multiple
                                                                                                value={categories}
                                                                                                onChange={(e) => { setCategories(e.target.value) }}
                                                                                                renderValue={(selected) => selected.join(', ')}
                                                                                                label="Category">
                                                                                                <MenuItem value="Luxury">Luxury</MenuItem>
                                                                                                <MenuItem value="Budget">Budget</MenuItem>
                                                                                                <MenuItem value="Business">Business</MenuItem>
                                                                                                <MenuItem value="Resort">Resort</MenuItem>
                                                                                            </Select>
                                                                                        </FormControl>
                                                                                    </Grid>

                                                                                    <Grid item xs={12} sm={12}>
                                                                                        <FormControl fullWidth>
                                                                                            <InputLabel>Facilities</InputLabel>
                                                                                            <Select
                                                                                                multiple
                                                                                                value={facilities}
                                                                                                onChange={(e) => { setfacilities(e.target.value) }}
                                                                                                renderValue={(selected) => selected.join(', ')}
                                                                                                label="Facilities">
                                                                                                <MenuItem value="Breakfast">Breakfast</MenuItem>
                                                                                                <MenuItem value="Parking">Parking</MenuItem>
                                                                                                <MenuItem value="Pool">Pool</MenuItem>
                                                                                                <MenuItem value="Spa">Spa</MenuItem>
                                                                                            </Select>
                                                                                        </FormControl>
                                                                                    </Grid>

                                                                                    <Grid item xs={12} sm={12}>
                                                                                        <FormControl fullWidth>
                                                                                            <InputLabel>Tags</InputLabel>
                                                                                            <Select
                                                                                                multiple
                                                                                                value={tags}
                                                                                                onChange={(e) => { settags(e.target.value) }}
                                                                                                renderValue={(selected) => selected.join(', ')}
                                                                                                label="Tags">
                                                                                                <MenuItem value="">Breakfast</MenuItem>
                                                                                                <MenuItem value="Parking">Parking</MenuItem>
                                                                                                <MenuItem value="Pool">Pool</MenuItem>
                                                                                                <MenuItem value="Spa">Spa</MenuItem>
                                                                                            </Select>
                                                                                        </FormControl>
                                                                                    </Grid>
                                                                                    <Grid item sm={12}>
                                                                                        {/* <Typography variant="h6" gutterBottom>
                                                                                            Room Images
                                                                                        </Typography> */}
                                                                                        <Box
                                                                                            {...getRootProps()}
                                                                                            sx={{
                                                                                                border: "2px dashed #ccc",
                                                                                                borderRadius: "4px",
                                                                                                padding: "20px",
                                                                                                textAlign: "center",
                                                                                                cursor: "pointer",
                                                                                                backgroundColor: isDragActive ? "#f0f0f0" : "transparent",
                                                                                                marginTop: "10px"
                                                                                            }}
                                                                                        >
                                                                                            <input {...getInputProps()} />
                                                                                            <Typography variant="body1" color="textSecondary">
                                                                                                {isDragActive ? "Drop files here..." : "Drag and drop files here or click to upload"}
                                                                                            </Typography>
                                                                                            <Button variant="contained" sx={{ mt: 2 }}>
                                                                                                Select Files
                                                                                            </Button>
                                                                                        </Box>
                                                                                        <Grid container spacing={2} style={{ marginTop: "15px", textAlign: "center" }}>
                                                                                            {files.map((file, index) => (
                                                                                                <Grid item key={index} xs={12} sm={3} md={3}>
                                                                                                    <Card>
                                                                                                        <CardMedia
                                                                                                            component="img"
                                                                                                            width="100%"
                                                                                                            height="100"
                                                                                                            image={file.preview}
                                                                                                            alt={file.name}
                                                                                                        />
                                                                                                        <Typography variant="body2" align="center" gutterBottom>
                                                                                                            {file.name}
                                                                                                        </Typography>
                                                                                                        <Button
                                                                                                            size="small"
                                                                                                            style={{ color: "red" }}
                                                                                                            onClick={() => handleRemoveFile(file)}
                                                                                                        >
                                                                                                            Remove
                                                                                                        </Button>
                                                                                                    </Card>
                                                                                                </Grid>
                                                                                            ))}
                                                                                        </Grid>
                                                                                    </Grid>
                                                                                    <Grid item xs={4}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            label="Room No"
                                                                                            placeholder='eg: 123'
                                                                                            variant="outlined"
                                                                                            margin="normal"
                                                                                            name={`room_no_${index}`}
                                                                                        />
                                                                                    </Grid>

                                                                                    <Grid item xs={4}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            label="Room Area"
                                                                                            placeholder='eg: in sq ft'
                                                                                            variant="outlined"
                                                                                            margin="normal"
                                                                                            name={`room_area_${index}`}
                                                                                        />
                                                                                    </Grid>

                                                                                    <Grid item xs={4}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            label="Floor"
                                                                                            placeholder='eg: 1'
                                                                                            variant="outlined"
                                                                                            margin="normal"
                                                                                            name={`floor_${index}`}
                                                                                        />
                                                                                    </Grid>

                                                                                    <Grid item xs={4}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            label="Beds"
                                                                                            placeholder='eg: 2'
                                                                                            variant="outlined"
                                                                                            margin="normal"
                                                                                            name={`beds_${index}`}
                                                                                        />
                                                                                    </Grid>

                                                                                    <Grid item xs={4}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            label="Bathrooms"
                                                                                             placeholder='eg: 2'
                                                                                            variant="outlined"
                                                                                            margin="normal"
                                                                                            name={`bathrooms_${index}`}
                                                                                        />
                                                                                    </Grid>

                                                                                    <Grid item xs={4}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            label="Guests"
                                                                                            variant="outlined"
                                                                                            placeholder='eg: 1 - 5'
                                                                                            margin="normal"
                                                                                            name={`guests_${index}`}
                                                                                        />
                                                                                    </Grid>

                                                                                    <Grid item xs={4}>
                                                                                        <TextField
                                                                                            fullWidth
                                                                                            label="Room Price"
                                                                                            placeholder='eg: $$$'
                                                                                            variant="outlined"
                                                                                            margin="normal"
                                                                                            name={`room_price_${index}`}
                                                                                        />
                                                                                    </Grid>
                                                                                </Grid>
                                                                            </Box>
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                            </Paper>
                                                        </Box>
                                                    </Grid>
                                                </React.Fragment>
                                            )}

                                            {/* Third Step: Completed */}
                                            {activeStep === 2 && (
                                                <React.Fragment>
                                                    <Grid container spacing={2} sx={{ p: 3 }}>
                                                        <Box sx={{ mt: 4, width: '100%' }}>
                                                            <form>
                                                                <Typography variant="h5" className='mb-3' gutterBottom>
                                                                    Owner and Support Details
                                                                </Typography>
                                                                <Grid container spacing={2}>
                                                                    {[
                                                                        { label: 'Owner Name', key: 'name', group: 'owner' },
                                                                        { label: 'Owner Contact', key: 'contactNo', group: 'owner' },
                                                                        { label: 'Owner Email', key: 'email', group: 'owner' },
                                                                    ].map((field, index) => (
                                                                        <Grid item xs={12} sm={6} key={index}>
                                                                            <TextField
                                                                                label={field.label}
                                                                                variant="outlined"
                                                                                fullWidth
                                                                                onChange={(e) =>
                                                                                    handleChange(field.key, e.target.value, field.group || undefined)
                                                                                }
                                                                            />
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                                <Grid container spacing={2} className='mt-3'>
                                                                    {[
                                                                        { label: 'Support Contact', key: 'contactNo', group: 'support' },
                                                                        { label: 'Support Email', key: 'email', group: 'support' },
                                                                    ].map((field, index) => (
                                                                        <Grid item xs={12} sm={6} key={index}>
                                                                            <TextField
                                                                                label={field.label}
                                                                                variant="outlined"
                                                                                fullWidth
                                                                                onChange={(e) =>
                                                                                    handleChange(field.key, e.target.value, field.group || undefined)
                                                                                }
                                                                            />
                                                                        </Grid>
                                                                    ))}
                                                                </Grid>
                                                            </form>
                                                        </Box>
                                                    </Grid>
                                                </React.Fragment>
                                            )}

                                            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                                                <Button
                                                    color="inherit"
                                                    disabled={activeStep === 0}
                                                    onClick={handleBack}
                                                    sx={{ mr: 1 }}
                                                >
                                                    Back
                                                </Button>
                                                <Box sx={{ flex: '1 1 auto' }} />
                                                <Button onClick={handleNext} sx={{ mr: 1 }}>
                                                    Next
                                                </Button>
                                                {activeStep !== steps.length &&
                                                    (completed[activeStep] ? (
                                                        <Typography variant="caption" sx={{ display: 'inline-block' }}>
                                                            Step {activeStep + 1} already completed
                                                        </Typography>
                                                    ) : (
                                                        <Button onClick={handleComplete}>
                                                            {completedSteps() === totalSteps() - 1
                                                                ? 'Finish'
                                                                : 'Complete Step'}
                                                        </Button>
                                                    ))}
                                            </Box>
                                        </React.Fragment>
                                    )}
                                </div>
                            </Box>
                        </Grid>

                    </DashboardCard>
                </Grid>
            </Grid >
        </PageContainer >

    );
};

export default AddHotel;
