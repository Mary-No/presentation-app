import { Router } from 'express';
import { prisma } from 'db/client';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

router.post('/presentations/:id/slides', async (req, res) => {
    const { id: presentationId } = req.params;
    const currentMax = await prisma.slide.aggregate({
        where: { presentationId },
        _max: { slideIndex: true },
    });

    const nextIndex = (currentMax._max.slideIndex ?? -1) + 1;
    try {
        const slide = await prisma.slide.create({
            data: {
                id: uuidv4(),
                presentationId,
                content: '',
                slideIndex: nextIndex,
            },
        });

        res.status(201).json(slide);
    } catch (err) {
        res.status(500).json({ error: 'Failed to add slide' });
    }
});

router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;

    try {
        const slide = await prisma.slide.update({
            where: { id },
            data: { content },
        });

        res.json(slide);
    } catch (err) {
        res.status(500).json({ error: 'Failed to update slide' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await prisma.slide.delete({ where: { id } });
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete slide' });
    }
});

export default router;
