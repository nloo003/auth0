import React from 'react'
import { withPageAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withPageAuthRequired(async function Profile() {
    const { user } = await getSession();
    return <div>Hello {user.nickname}</div>;
}, { returnTo: '/serverPage' })