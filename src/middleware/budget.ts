import type { Request, Response, NextFunction } from 'express'
import { param, validationResult, body } from 'express-validator'
import Budget from '../models/Budget';

declare global {
      namespace Express {
            interface Request {
                  budget?: Budget
            }
      }
}

export const validateBudgetId = async (req: Request, res: Response, next: NextFunction) => {

      await param('budgetId')
            .isInt()
            .withMessage('ID no válido')
            .custom(value => value > 0)
            .withMessage('Id no válido')
            .run(req)

      let errors = validationResult(req)
      if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
      }
      next()
}

export const validateBudgetExists = async (req: Request, res: Response, next: NextFunction) => {
      try {
            const { budgetId } = req.params
            const budget = await Budget.findByPk(+budgetId)

            if (!budget) {
                  const error = new Error('Presupuesto no encontrado')
                  return res.status(404).json({
                        error: error.message
                  })
            }

            req.budget = budget

            next()

      } catch (error) {
            console.log(error)
            res.status(500).json({
                  message: 'Error al crear el presupuesto'
            })
      }

}

export const validateBudgetInput = async (req: Request, res: Response, next: NextFunction) => {

      await body('name')
            .notEmpty()
            .withMessage('El nombre de presupuesto no puede ir vacio')
            .run(req)
      await body('amount')
            .notEmpty()
            .withMessage('El cantidad del presupuesto no puede ir vacio')
            .isNumeric()
            .withMessage('Cantidad no válida')
            .custom(value => value > 0).withMessage('El presupuesto debe ser mayor a cero')
            .run(req)
      next()
}
