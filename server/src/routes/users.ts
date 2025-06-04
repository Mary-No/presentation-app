import { Router } from 'express';
import { prisma } from '../db/client';


const router = Router();

router.post('/', async (req, res) => {
    const { nickname } = req.body;

    if (!nickname) {
        return res.status(400).json({ error: 'Nickname is required' });
    }

    try {
        const user = await prisma.user.create({
            data: { nickname },
        });
        res.status(201).json(user);
    } catch (err: any) {
        if (err.code === 'P2002') {
            return res.status(409).json({ error: 'Nickname already taken' });
        }
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/:nickname/presentations', async (req, res) => {
    const { nickname } = req.params;

    const roles = await prisma.userRole.findMany({
        where: { userNickname: nickname },
        include: { presentation: true },
    });

    const presentations = roles.map((r) => r.presentation);
    res.json(presentations);
});

export default router;
