import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client';
import { prisma } from '../db/client';

const router = Router();

router.post('/', async (req, res) => {
    const { title, creatorNickname } = req.body;

    if (!title || !creatorNickname) {
        return res.status(400).json({ error: 'Title and creatorNickname are required' });
    }

    try {
        const presentation = await prisma.presentation.create({
            data: {
                id: uuidv4(),
                title,
                ownerNickname: creatorNickname,
                roles: {
                    create: {
                        userNickname: creatorNickname,
                        role: Role.creator,
                    },
                },
            },
        });

        res.status(201).json(presentation);
    } catch (err) {
        res.status(500).json({ error: 'Failed to create presentation' });
    }
});


import { Prisma } from '@prisma/client'

router.get('/', async (req, res) => {
    const { query } = req.query;

    const where = query
        ? {
            title: {
                contains: query as string,
                mode: 'insensitive' as Prisma.QueryMode,
            },
        }
        : undefined;

    try {
        const presentations = await prisma.presentation.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });

        res.json(presentations);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch presentations' });
    }
});


router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const { nickname } = req.query;

    if (!nickname) {
        return res.status(400).json({ error: 'Nickname is required' });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { nickname: nickname as string },
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const presentation = await prisma.presentation.findUnique({
            where: { id },
            include: { slides: true, roles: true },
        });

        if (!presentation) {
            return res.status(404).json({ error: 'Presentation not found' });
        }

        const userRole = await prisma.userRole.upsert({
            where: {
                presentationId_userNickname: {
                    presentationId: id,
                    userNickname: nickname as string,
                },
            },
            update: {},
            create: {
                presentationId: id,
                userNickname: nickname as string,
                role: Role.viewer,
            },
        });

        const updatedPresentation = await prisma.presentation.findUnique({
            where: { id },
            include: { slides: true, roles: true },
        });

        res.json(updatedPresentation);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to get presentation' });
    }
});

router.patch('/:id/roles', async (req, res) => {
    const { id } = req.params;
    const { nickname, newRole, requestedBy } = req.body;

    if (!nickname || !newRole || !requestedBy) {
        return res.status(400).json({ error: 'Nickname, newRole and requestedBy are required' });
    }

    try {
        const requesterRole = await prisma.userRole.findUnique({
            where: {
                presentationId_userNickname: {
                    presentationId: id,
                    userNickname: requestedBy,
                },
            },
        });
        const existingRole = await prisma.userRole.findUnique({
            where: {
                presentationId_userNickname: {
                    presentationId: id,
                    userNickname: nickname,
                },
            },
        });

        if (!existingRole) {
            return res.status(404).json({ error: 'User role not found for this presentation' });
        }

        if (!requesterRole || requesterRole.role !== 'creator') {
            return res.status(403).json({ error: 'Only creator can change roles' });
        }

        const updated = await prisma.userRole.update({
            where: {
                presentationId_userNickname: {
                    presentationId: id,
                    userNickname: nickname,
                },
            },
            data: { role: newRole },
        });

        res.json(updated);
    } catch (err) {
        console.log(err)
        res.status(500).json({ error: 'Failed to update role' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ error: 'Nickname is required' });
    }

    try {
        const role = await prisma.userRole.findUnique({
            where: {
                presentationId_userNickname: {
                    presentationId: id,
                    userNickname: nickname,
                },
            },
        });

        if (!role || role.role !== Role.creator) {
            return res.status(403).json({ error: 'Only creator can delete the presentation' });
        }

        await prisma.presentation.delete({
            where: { id },
        });

        res.status(200).json({ message: 'Presentation deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to delete presentation' });
    }
});


export default router;
