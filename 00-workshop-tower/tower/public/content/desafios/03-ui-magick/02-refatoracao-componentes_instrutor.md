## Cola do prompt

No componente @imageProcessor.ts há duplicação de código entre os filtros @blurImage() e @sharpenImage(). Imagine que vamos implementar novos filtros ainda. Facilite a adição sustentável de novos filtros.