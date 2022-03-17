import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletError, WalletNotConnectedError } from '@solana/wallet-adapter-base';
import { Connection, PublicKey, clusterApiUrl, Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import React, { useCallback, FC, useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Program, Provider, web3 } from '@project-serum/anchor';
import * as anchor from "@project-serum/anchor";


import idl from '../../utils/idl.json'

// Get our program's id from the IDL file.
const programID = new PublicKey('5eHD6sbs1auxr22YtJjDTnn9WRfvccfBLS5v8AbwpFNM');
// const program = anchor.workspace.FitSol;

// import styles from './GetBalance.module.css';
import { Button } from '@mui/material';

const network = clusterApiUrl('devnet');
const opts = {
    preflightCommitment: "processed"
}

export const CreateChallengeNew = () => {
    const [open, setOpen] = React.useState(false);
    const [challengeName, setChallengeName] = useState('')
    const [days, setDays] = useState();
    const [solAmount, setSolAmount] = useState();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {

        setOpen(false)
    }

    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(connection, window.solana, opts.preflightCommitment,);

        return provider;
    }

    const createChallenge = async () => {
        try {
            const provider = getProvider()
            const program = new Program(idl, programID, provider)
            const [challenge, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("challenge")), program.provider.wallet.publicKey.toBuffer()],
                program.programId
            );

            console.log("CHALLENGE PDA", challenge.toString());
            const tx = await program.rpc.createChallenge(challengeName, new anchor.BN(days), new anchor.BN(anchor.web3.LAMPORTS_PER_SOL * solAmount), {
                accounts: {
                    authority: program.provider.wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
                    challenge: challenge
                }
            });
            console.log("Your transaction signature", tx);
            setOpen(false)
        } catch (error) {
            console.log(error)
        }
    }




    return (
        <div>
            <Button variant="text" onClick={handleClickOpen}><p style={{color: 'white'}}>Create Challenge</p></Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Challenge Details</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please enter the challenge details
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Challenge Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(event) => setChallengeName(event.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Duration (days)"
                        type="text"
                        fullWidth
                        variant="standard"
                        onChange={(event) => setDays(event.target.value)}
                    />
                    <TextField
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Max Amount (SOL)"
                        type="number"
                        fullWidth
                        variant="standard"
                        onChange={(event) => setSolAmount(event.target.value)}
                    />

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={createChallenge} variant='contained' >Create Challenge</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}