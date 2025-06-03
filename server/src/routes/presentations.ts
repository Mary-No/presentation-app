import { Router } from 'express';
import { prisma } from 'db/client';
import { v4 as uuidv4 } from 'uuid';
import { Role } from '@prisma/client';

const router = Router();

// создать презентацию
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

// галерея всех презентаций
router.get('/', async (_, res) => {
    const presentations = await prisma.presentation.findMany({
        orderBy: { createdAt: 'desc' },
    });
    res.json(presentations);
});

// получить презентацию
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    const presentation = await prisma.presentation.findUnique({
        where: { id },
        include: { slides: true, roles: true },
    });

    if (!presentation) return res.status(404).json({ error: 'Not found' });
    res.json(presentation);
});

// смена роли
router.patch('/:id/roles', async (req, res) => {
    const { id } = req.params;
    const { nickname, newRole } = req.body;

    if (!nickname || !newRole) {
        return res.status(400).json({ error: 'Nickname and newRole are required' });
    }

    try {
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
        res.status(500).json({ error: 'Failed to update role' });
    }
});

export default router;
