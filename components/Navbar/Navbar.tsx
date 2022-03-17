import React, { FC, useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';
import { GetBalance } from '../GetBalance/GetBalance';
import { SendTransaction } from '../Transaction/transaction'
import { Content } from '../WalletConnection/WalletConnection';
import styles from './Navbar.module.css';
import { CreateChallengeNew } from '../CreateChallenge/CreateChallengeV1';

export const NavAppBar: FC = (props) => {
    return (
        <div>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ mr: 2, display: { xs: 'none', md: 'flex' } }}
                        >
                            FITsol
                        </Typography>
                        <GetBalance />
                        {/* <SendTransaction /> */}
                        <CreateChallengeNew/>
                        <div className={styles.alignButtonTopRight}>
                            <Content />
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
        </div>
    );
};
