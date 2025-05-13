import { Accountant } from "src/accountants/entities/accountant.entity";
import { Receptionist } from "src/receptionists/entities/receptionist.entity";
import { Technician } from "src/technicians/entities/technician.entity";
import { Check, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Check(`("receptionistId" IS NOT NULL AND "accountantId" IS NULL AND "technicianId" IS NULL) OR ("receptionistId" IS NULL AND "accountantId" IS NOT NULL AND "technicianId" IS NULL) OR ("receptionistId" IS NULL AND "accountantId" IS NULL AND "technicianId" IS NOT NULL) OR ("receptionistId" IS NULL AND "accountantId" IS NULL AND "technicianId" IS NULL)`)
@Entity()
export class Task {
    @PrimaryGeneratedColumn("uuid")
    id: string

    @Column()
    title: string

    @Column()
    description: string

    @Column({ default: false })
    isComplete: boolean

    @Column()
    deadline: Date

    @JoinColumn()
    @ManyToOne(() => Receptionist, receptionist => receptionist.tasks, { nullable: true, onDelete: "SET NULL" })
    receptionist: Receptionist

    @JoinColumn()
    @ManyToOne(() => Accountant, accountant => accountant.tasks, { nullable: true, onDelete: "SET NULL" })
    accountant: Accountant

    @JoinColumn()
    @ManyToOne(() => Technician, technician => technician.tasks, { nullable: true, onDelete: "SET NULL" })
    technician: Technician

    @CreateDateColumn()
    createdAt: Date

    @UpdateDateColumn()
    updatedAt: Date
}
