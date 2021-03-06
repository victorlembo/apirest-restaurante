USE [RESTAURANTE]
GO
/****** Object:  StoredProcedure [dbo].[SP_I_RES_PRATOS]    Script Date: 04/10/2021 10:16:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[SP_I_RES_PRATOS]
	@NOME VARCHAR(100),
	@DESCRICAO VARCHAR(50),
	@PRECO NUMERIC(7,2),
	@CODIGOGERADO INT=0 OUT
AS
SET NOCOUNT ON
DECLARE @NR_PRATOS INT

SELECT @NR_PRATOS = COUNT(PRA_ST_NOME)
FROM RES_PRATOS
WHERE PRA_ST_NOME = @NOME

IF @NR_PRATOS > 0
BEGIN
  RAISERROR('Esse nome de prato já existe!',15,1)
  RETURN
END

IF LEN(TRIM(@NOME)) < 3
BEGIN
   RAISERROR('O nome do prato deve possuir no mínimo 3 caracteres!',15,1)
   RETURN
END

INSERT INTO RES_PRATOS (PRA_ST_NOME, PRA_ST_DESCRICAO, PRA_RE_PRECO) VALUES (@NOME, @DESCRICAO, @PRECO)
SET @CODIGOGERADO = SCOPE_IDENTITY() 
PRINT @CODIGOGERADO
RETURN @CODIGOGERADO
