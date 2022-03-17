import React, { useCallback, FC, useState, useEffect } from 'react';
import { Connection, PublicKey, clusterApiUrl, Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import * as anchor from "@project-serum/anchor";

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import idl from '../../utils/idl.json'
import { ChaletOutlined } from '@mui/icons-material';

// Get our program's id from the IDL file.
const programID = new PublicKey('5eHD6sbs1auxr22YtJjDTnn9WRfvccfBLS5v8AbwpFNM');
const network = clusterApiUrl('devnet');
const opts = {
    preflightCommitment: "processed"
}


export const ShowChallenges = () => {

    const [allChallenges, setAllChallenges] = useState([])
    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(connection, window.solana, opts.preflightCommitment,);

        return provider;
    }

    const getChallenges = async () => {
        try {
            const provider = getProvider()
            const program = new Program(idl, programID, provider)
            const [challenge, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("challenge")), program.provider.wallet.publicKey.toBuffer()],
                program.programId
            );

            console.log("CHALLENGE PDA", challenge.toString());
            const challenges = await program.account.challenge.all()
            setAllChallenges(challenges)
            console.log("Challenges", challenges)
        } catch (err) {
            console.error(err)
        }
    }

    const joinChallenge = async (amount) => {
        try {
            const provider = getProvider()
            const program = new Program(idl, programID, provider)
            const [user, _unonce] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("user")), program.provider.wallet.publicKey.toBuffer(), program.provider.wallet.publicKey.toBuffer()],
                program.programId
            );

            const [challenge, _nonce] = await anchor.web3.PublicKey.findProgramAddress(
                [Buffer.from(anchor.utils.bytes.utf8.encode("challenge")), program.provider.wallet.publicKey.toBuffer()],
                program.programId
            );


            const tx = await program.rpc.joinChallenge(new anchor.BN(amount), {
                accounts: {
                    user: program.provider.wallet.publicKey,
                    systemProgram: anchor.web3.SystemProgram.programId,
                    creator: program.provider.wallet.publicKey,
                    userAccount: user,
                    challenge: challenge
                },
            })

            console.log("Your transaction signature", tx);
            getChallenges()
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {

        getChallenges()

    }, [])


    return (
        <>
            {allChallenges.length !== 0 ? allChallenges.map((challenge, index) => (
                <div key={index}>
                    <Card sx={{ minWidth: 275 }}>
                        <CardContent>
                            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                Challenge #{index + 1}
                            </Typography>
                            <Typography variant="h5" component="div">
                                {challenge.account.name}
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {challenge.account.duration.toNumber()} days
                            </Typography>
                            <Typography sx={{ mb: 1.5 }} color="text.secondary">
                                {challenge.account.maxAmount.toNumber() / LAMPORTS_PER_SOL} SOL
                            </Typography>
                            <Typography variant="body2">
                                Challenge description
                            </Typography>
                            {challenge.account.participants.toNumber()}
                        </CardContent>
                        <CardActions>
                            <Button variant='contained' size="small" onClick={() => joinChallenge(challenge.account.maxAmount.toNumber())}>Join Now</Button>
                        </CardActions>
                    </Card>
                </div>
            ))
                : 'loading'
            }
        </>
    )
}