import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import BankCard from 'App/Models/BankCard'

export default class BankCardsController {
  /**
   * Lista todas las tarjetas de un cliente
   * GET /clients/:clientId/bank-cards
   */
  public async index({ params, request, response }: HttpContextContract) {
    try {
      const clientId = params.clientId
      const isActive = request.input('is_active')

      const query = BankCard.query().where('client_id', clientId)

      if (isActive !== undefined) {
        query.where('is_active', isActive === 'true')
      }

      const cards = await query.orderBy('is_default', 'desc').orderBy('created_at', 'desc')

      return response.ok(cards)
    } catch (error) {
      return response.badRequest({
        message: 'Error al obtener tarjetas',
        error: error.message,
      })
    }
  }

  /**
   * Crea una nueva tarjeta bancaria
   * POST /clients/:clientId/bank-cards
   */
  public async store({ params, request, response }: HttpContextContract) {
    try {
      console.log('⚠️ BankCardsController.store - TESTING MODE')

      const clientId = params.clientId

      const data = request.only([
        'cardholderName',
        'cardHolderName',
        'cardNumber',
        'cardType',
        'cardBrand',
        'expiryDate',
        'expiryMonth',
        'expiryYear',
        'cvv',
        'billingAddress',
        'billingCity',
        'billingCountry',
        'billingZipCode',
        'isDefault',
      ])

      // Mapeo de nombres de campo
      const cardHolderName = data.cardHolderName || data.cardholderName || 'Titular de prueba'

      // Parsear expiryDate si viene en formato MM/YY
      let expiryMonth = data.expiryMonth
      let expiryYear = data.expiryYear

      if (data.expiryDate && typeof data.expiryDate === 'string' && data.expiryDate.includes('/')) {
        const [month, year] = data.expiryDate.split('/')
        expiryMonth = parseInt(month)
        expiryYear = parseInt('20' + year) // Convertir YY a YYYY
      }

      // Mapeo de cardType español a inglés
      const cardTypeMap = {
        credito: 'credit',
        crédito: 'credit',
        debito: 'debit',
        débito: 'debit',
      }
      const cardType = cardTypeMap[data.cardType?.toLowerCase()] || data.cardType || 'credit'

      // Si es tarjeta por defecto, quitar el default de las demás
      if (data.isDefault) {
        await BankCard.query().where('client_id', clientId).update({ is_default: false })
      }

      const card = await BankCard.create({
        clientId,
        cardHolderName: cardHolderName,
        cardNumber: data.cardNumber || '0000000000000000',
        cardType: cardType,
        cardBrand: data.cardBrand || 'Visa',
        expiryMonth: expiryMonth || 12,
        expiryYear: expiryYear || 2030,
        cvv: data.cvv || '000',
        billingAddress: data.billingAddress || 'Dirección de prueba',
        billingCity: data.billingCity || 'Ciudad de prueba',
        billingCountry: data.billingCountry || 'Colombia',
        billingZipCode: data.billingZipCode || '00000',
        isDefault: data.isDefault !== undefined ? data.isDefault : false,
        isActive: true,
      })

      return response.created({
        message: 'Tarjeta registrada exitosamente',
        data: card,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al registrar tarjeta',
        error: error.message,
      })
    }
  }

  /**
   * Muestra una tarjeta específica
   * GET /bank-cards/:id
   */
  public async show({ params, response }: HttpContextContract) {
    try {
      const card = await BankCard.query().where('id', params.id).preload('client').firstOrFail()

      return response.ok(card)
    } catch (error) {
      return response.notFound({
        message: 'Tarjeta no encontrada',
        error: error.message,
      })
    }
  }

  /**
   * Actualiza una tarjeta
   * PUT /bank-cards/:id
   */
  public async update({ params, request, response }: HttpContextContract) {
    try {
      const card = await BankCard.findOrFail(params.id)

      const data = request.only([
        'cardHolderName',
        'expiryMonth',
        'expiryYear',
        'billingAddress',
        'billingCity',
        'billingCountry',
        'billingZipCode',
        'isDefault',
        'isActive',
      ])

      // Si se marca como default, quitar el default de las demás del mismo cliente
      if (data.isDefault) {
        await BankCard.query()
          .where('client_id', card.clientId)
          .where('id', '!=', card.id)
          .update({ is_default: false })
      }

      card.merge(data)
      await card.save()

      return response.ok({
        message: 'Tarjeta actualizada exitosamente',
        data: card,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al actualizar tarjeta',
        error: error.message,
      })
    }
  }

  /**
   * Elimina (desactiva) una tarjeta
   * DELETE /bank-cards/:id
   */
  public async destroy({ params, response }: HttpContextContract) {
    try {
      const card = await BankCard.findOrFail(params.id)

      // En vez de eliminar, desactivar
      card.isActive = false
      await card.save()

      return response.ok({
        message: 'Tarjeta desactivada exitosamente',
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al desactivar tarjeta',
        error: error.message,
      })
    }
  }

  /**
   * Marca una tarjeta como predeterminada
   * PATCH /bank-cards/:id/set-default
   */
  public async setDefault({ params, response }: HttpContextContract) {
    try {
      const card = await BankCard.findOrFail(params.id)

      // Quitar default de todas las tarjetas del cliente
      await BankCard.query().where('client_id', card.clientId).update({ is_default: false })

      // Marcar esta como default
      card.isDefault = true
      await card.save()

      return response.ok({
        message: 'Tarjeta establecida como predeterminada',
        data: card,
      })
    } catch (error) {
      return response.badRequest({
        message: 'Error al establecer tarjeta predeterminada',
        error: error.message,
      })
    }
  }
}
